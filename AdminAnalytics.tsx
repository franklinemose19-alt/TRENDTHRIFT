import { useEffect, useState } from 'react'
import { fetchProductsWithStats, sortProducts } from '@/services/products'
import { fetchViewsLast30Days } from '@/services/admin'
import AnalyticsChart from '@/components/AnalyticsChart'
import type { ProductWithStats } from '@/types'

export default function AdminAnalytics() {
  const [products, setProducts] = useState<ProductWithStats[]>([])
  const [chartData, setChartData] = useState<{ date: string; views: number }[]>([])

  useEffect(() => {
    fetchProductsWithStats().then(setProducts)
    fetchViewsLast30Days().then(setChartData)
  }, [])

  const mostViewed = sortProducts(products, 'most_viewed').slice(0, 5)
  const mostLiked = sortProducts(products, 'most_liked').slice(0, 5)
  const mostEnquired = [...products].sort((a, b) => b.whatsapp_click_count - a.whatsapp_click_count).slice(0, 5)

  return (
    <div>
      <h1 className="font-display text-2xl">Analytics</h1>

      <div className="mt-6">
        <AnalyticsChart data={chartData} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Ranking title="Most viewed" items={mostViewed.map((p) => ({ label: p.name, value: p.view_count + ' views' }))} />
        <Ranking title="Most liked" items={mostLiked.map((p) => ({ label: p.name, value: p.like_count + ' likes' }))} />
        <Ranking title="Most enquired" items={mostEnquired.map((p) => ({ label: p.name, value: p.whatsapp_click_count + ' clicks' }))} />
      </div>
    </div>
  )
}

function Ranking({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <p className="mb-3 text-sm text-white/60">{title}</p>
      <ol className="space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item.label}</span>
            <span className="text-white/50">{item.value}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
