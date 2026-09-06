import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, serverTimestamp, getCountFromServer, Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import type { AdminSettings, OverviewStats, Product } from '@/types'

export async function fetchSettings(): Promise<AdminSettings> {
  const snap = await getDoc(doc(db, 'adminSettings', 'main'))
  if (!snap.exists()) {
    const defaults: AdminSettings = {
      store_name: 'THRIFT WEARs',
      whatsapp_number: '',
      store_description: '',
      instagram_url: null,
      tiktok_url: null,
      facebook_url: null,
      updated_at: new Date().toISOString(),
    }
    await setDoc(doc(db, 'adminSettings', 'main'), { ...defaults, updated_at: serverTimestamp() })
    return defaults
  }
  const data = snap.data()
  return {
    store_name: data.store_name,
    whatsapp_number: data.whatsapp_number,
    store_description: data.store_description,
    instagram_url: data.instagram_url ?? null,
    tiktok_url: data.tiktok_url ?? null,
    facebook_url: data.facebook_url ?? null,
    updated_at: (data.updated_at as Timestamp)?.toDate?.().toISOString() ?? new Date().toISOString(),
  }
}

export async function updateSettings(patch: Partial<AdminSettings>): Promise<void> {
  await setDoc(doc(db, 'adminSettings', 'main'), { ...patch, updated_at: serverTimestamp() }, { merge: true })
}

export async function fetchOverviewStats(): Promise<OverviewStats> {
  const productsCol = collection(db, 'products')
  const [total, views, likes, clicks, available, sold] = await Promise.all([
    getCountFromServer(productsCol),
    getCountFromServer(collection(db, 'productViews')),
    getCountFromServer(collection(db, 'productLikes')),
    getCountFromServer(collection(db, 'whatsappClicks')),
    getCountFromServer(query(productsCol, where('status', '==', 'available'))),
    getCountFromServer(query(productsCol, where('status', '==', 'sold'))),
  ])

  return {
    totalProducts: total.data().count,
    totalViews: views.data().count,
    totalLikes: likes.data().count,
    whatsappEnquiries: clicks.data().count,
    availableProducts: available.data().count,
    soldProducts: sold.data().count,
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return docRef.id
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), { ...patch, updated_at: serverTimestamp() })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id))
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = 'products/' + crypto.randomUUID() + '.' + ext
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function fetchViewsLast30Days(): Promise<{ date: string; views: number }[]> {
  const since = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const q = query(collection(db, 'productViews'), where('created_at', '>=', since))
  const snap = await getDocs(q)

  const counts: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    counts[d.toISOString().slice(0, 10)] = 0
  }
  snap.docs.forEach((d) => {
    const ts = d.data().created_at as Timestamp
    const day = ts?.toDate?.().toISOString().slice(0, 10)
    if (day && day in counts) counts[day]++
  })

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, views]) => ({ date, views }))
}
