import { useEffect, useState } from 'react'
import { fetchOverviewStats } from '@/services/admin'
import StatsCard from '@/components/StatsCard'
import type { OverviewStats } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null)

  useEffect(() => {
    fetchOverviewStats().then(setStats)
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Overview of your store's activity.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatsCard label="Total products" value={stats?.totalProducts ?? '—'} />
        <StatsCard label="Available" value={stats?.availableProducts ?? '—'} />
        <StatsCard label="Sold" value={stats?.soldProducts ?? '—'} />
        <StatsCard label="Total views" value={stats?.totalViews ?? '—'} />
        <StatsCard label="Total likes" value={stats?.totalLikes ?? '—'} />
        <StatsCard label="WhatsApp enquiries" value={stats?.whatsappEnquiries ?? '—'} />
      </div>
    </div>
  )
}
