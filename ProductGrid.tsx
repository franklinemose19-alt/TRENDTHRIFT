import ProductCard from '@/components/ProductCard'
import type { ProductWithStats } from '@/types'

export default function ProductGrid({ products }: { products: ProductWithStats[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-stone">No products match your filters yet.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
