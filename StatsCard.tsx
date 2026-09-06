export default function StatsCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-medium">{value}</p>
    </div>
  )
}
