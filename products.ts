import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where,
  orderBy, serverTimestamp, getCountFromServer, Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getVisitorId } from '@/utils/visitorId'
import type { Product, ProductWithStats, SortOption } from '@/types'

const VIEW_DEDUPE_WINDOW_HOURS = 24

function toProduct(id: string, data: any): Product {
  return {
    id,
    name: data.name,
    price: data.price,
    category: data.category,
    size: data.size,
    condition: data.condition,
    description: data.description ?? null,
    images: data.images ?? [],
    status: data.status,
    created_at: (data.created_at as Timestamp)?.toDate?.().toISOString() ?? new Date().toISOString(),
    updated_at: (data.updated_at as Timestamp)?.toDate?.().toISOString() ?? new Date().toISOString(),
  }
}

async function statsFor(productId: string, visitorId: string) {
  const viewsQ = query(collection(db, 'productViews'), where('productId', '==', productId))
  const likesQ = query(collection(db, 'productLikes'), where('productId', '==', productId))
  const clicksQ = query(collection(db, 'whatsappClicks'), where('productId', '==', productId))
  const myLikeQ = query(
    collection(db, 'productLikes'),
    where('productId', '==', productId),
    where('visitorId', '==', visitorId),
  )

  const [viewsCount, likesCount, clicksCount, myLikeSnap] = await Promise.all([
    getCountFromServer(viewsQ),
    getCountFromServer(likesQ),
    getCountFromServer(clicksQ),
    getDocs(myLikeQ),
  ])

  return {
    view_count: viewsCount.data().count,
    like_count: likesCount.data().count,
    whatsapp_click_count: clicksCount.data().count,
    liked_by_visitor: !myLikeSnap.empty,
  }
}

export async function fetchProductsWithStats(): Promise<ProductWithStats[]> {
  const visitorId = getVisitorId()

  const q = query(
    collection(db, 'products'),
    where('status', 'in', ['available', 'sold']),
    orderBy('created_at', 'desc'),
  )
  const snap = await getDocs(q)
  const products = snap.docs.map((d) => toProduct(d.id, d.data()))

  const withStats = await Promise.all(
    products.map(async (p) => ({ ...p, ...(await statsFor(p.id, visitorId)) })),
  )

  return withStats
}

export async function fetchProductById(id: string): Promise<ProductWithStats | null> {
  const visitorId = getVisitorId()
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null

  const product = toProduct(snap.id, snap.data())
  const stats = await statsFor(id, visitorId)
  return { ...product, ...stats }
}

export async function recordView(productId: string): Promise<void> {
  const visitorId = getVisitorId()
  const since = Timestamp.fromDate(new Date(Date.now() - VIEW_DEDUPE_WINDOW_HOURS * 60 * 60 * 1000))

  const recentQ = query(
    collection(db, 'productViews'),
    where('productId', '==', productId),
    where('visitorId', '==', visitorId),
    where('created_at', '>=', since),
  )
  const recentSnap = await getDocs(recentQ)
  if (!recentSnap.empty) return

  await addDoc(collection(db, 'productViews'), {
    productId,
    visitorId,
    created_at: serverTimestamp(),
  })
}

export async function toggleLike(productId: string, currentlyLiked: boolean): Promise<boolean> {
  const visitorId = getVisitorId()
  const likeQ = query(
    collection(db, 'productLikes'),
    where('productId', '==', productId),
    where('visitorId', '==', visitorId),
  )

  if (currentlyLiked) {
    const snap = await getDocs(likeQ)
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
    return false
  } else {
    await addDoc(collection(db, 'productLikes'), {
      productId,
      visitorId,
      created_at: serverTimestamp(),
    })
    return true
  }
}

export async function recordWhatsAppClick(productId: string): Promise<void> {
  const visitorId = getVisitorId()
  await addDoc(collection(db, 'whatsappClicks'), {
    productId,
    visitorId,
    created_at: serverTimestamp(),
  })
}

export function sortProducts(products: ProductWithStats[], sort: SortOption): ProductWithStats[] {
  const arr = [...products]
  switch (sort) {
    case 'most_viewed':
      return arr.sort((a, b) => b.view_count - a.view_count)
    case 'most_liked':
      return arr.sort((a, b) => b.like_count - a.like_count)
    case 'price_low':
      return arr.sort((a, b) => a.price - b.price)
    case 'price_high':
      return arr.sort((a, b) => b.price - a.price)
    case 'newest':
    default:
      return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
}

export function buildWhatsAppLink(whatsappNumber: string, product: Pick<Product, 'name' | 'price'>): string {
  const message = 'Hi THRIFT WEARs, I am interested in ordering the ' + product.name + ' for KSh ' + product.price.toLocaleString() + '. Is it still available?'
  const digits = whatsappNumber.replace(/[^\d]/g, '')
  return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(message)
}
