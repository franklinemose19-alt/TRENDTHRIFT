import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { MessageCircle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useSettings } from '@/hooks/useSettings'
import ProductGrid from '@/components/ProductGrid'
import { sortProducts } from '@/services/products'

const categories = ['Jackets', 'Jeans', 'Shirts', 'T-Shirts', 'Pants']

export default function Home() {
  const { products, loading } = useProducts()
  const settings = useSettings()

  const available = useMemo(() => products.filter((p) => p.status === 'available'), [products])
  const latest = available.slice(0, 4)
  const popular = useMemo(() => sortProducts(available, 'most_liked').slice(0, 4), [available])

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
              Thrifted pieces, chosen one at a time.
            </h1>
            <p className="mt-4 max-w-sm text-stone">
              Every item in our showroom is a single find — no restocks, no duplicates. Browse the
              collection, then message us to make it yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02]"
              >
                Browse the collection
              </Link>
              {settings?.whatsapp_number && (
                
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:border-ink/30"
                >
                  <MessageCircle size={18} />
                  Chat with us
                </a>
              )}
            </div>
          </div>
          {latest[0] && (
            <div className="aspect-[4/5] overflow-hidden bg-ink/5">
              <img src={latest[0].images[0]} alt={latest[0].name} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-ink/10 py-6">
        <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 text-sm">
          {categories.map((c) => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="whitespace-nowrap text-stone hover:text-ink">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-ink">Latest drops</h2>
          <Link to="/shop" className="text-sm text-stone hover:text-ink">View all</Link>
        </div>
        {!loading && <ProductGrid products={latest} />}
      </section>

      {popular.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="mb-6 font-display text-2xl text-ink">Popular right now</h2>
          <ProductGrid products={popular} />
        </section>
      )}
    </div>
  )
}
