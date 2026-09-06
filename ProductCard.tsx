import { Link } from 'react-router-dom'
import { Eye, Heart } from 'lucide-react'
import type { ProductWithStats } from '@/types'

export default function ProductCard({ product }: { product: ProductWithStats }) {
  const sold = product.status === 'sold'

  return (
    <Link to={'/product/' + product.id} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
        <img
          src={product.images[0]}
          alt={product.name}
          className={'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ' + (sold ? 'grayscale' : '')}
          loading="lazy"
        />
        {sold && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs text-paper">
            Sold
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        <p className="text-sm text-stone">
          KSh {product.price.toLocaleString()} - Size {product.size}
        </p>
        <p className="flex items-center gap-3 text-xs text-stone">
          <span className="inline-flex items-center gap-1"><Eye size={13} /> {product.view_count}</span>
          <span className="inline-flex items-center gap-1"><Heart size={13} /> {product.like_count}</span>
        </p>
      </div>
    </Link>
  )
}
