import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsChart({ data }: { data: { date: string; views: number }[] }) {
  return (
    <div className="h-64 rounded-2xl border border-white/10 p-5">
      <p className="mb-4 text-sm text-white/60">Views — last 30 days</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(d) => d.slice(5)} />
          <YAxis tick={{ fontSize: 10, fill: '#888' }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#1a1a1b', border: '1px solid #333', fontSize: 12 }} />
          <Line type="monotone" dataKey="views" stroke="#e8e8e6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
