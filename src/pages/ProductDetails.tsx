import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useProduct } from '@/hooks/useProduct'
import { useSettings } from '@/hooks/useSettings'
import ProductGallery from '@/components/ProductGallery'
import LikeButton from '@/components/LikeButton'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ProductDetails() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const settings = useSettings()

  if (loading) return <p className="py-24 text-center text-stone">Loading…</p>
  if (!product) return <p className="py-24 text-center text-stone">Product not found.</p>

  const sold = product.status === 'sold'

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-stone hover:text-ink">
        <ChevronLeft size={16} /> Back to shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <h1 className="font-display text-3xl text-ink">{product.name}</h1>
          <p className="mt-2 text-xl text-ink">KSh {product.price.toLocaleString()}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-stone">Size</dt>
              <dd className="text-ink">{product.size}</dd>
            </div>
            <div>
              <dt className="text-stone">Category</dt>
              <dd className="text-ink">{product.category}</dd>
            </div>
            <div>
              <dt className="text-stone">Condition</dt>
              <dd className="text-ink">{product.condition}</dd>
            </div>
            <div>
              <dt className="text-stone">Availability</dt>
              <dd className="text-ink">{sold ? 'Sold' : 'Available'}</dd>
            </div>
          </dl>

          {product.description && <p className="mt-6 text-stone">{product.description}</p>}

          <p className="mt-6 text-xs text-stone">
            {product.view_count} views · {product.like_count} likes
          </p>

          <div className="mt-6 flex items-center gap-3">
            <LikeButton productId={product.id} liked={!!product.liked_by_visitor} count={product.like_count} />
            {!sold && settings?.whatsapp_number && (
              <WhatsAppButton product={product} whatsappNumber={settings.whatsapp_number} full />
            )}
          </div>
          {sold && <p className="mt-3 text-sm text-stone">This piece has already found a home.</p>}
        </div>
      </div>
    </div>
  )
}
