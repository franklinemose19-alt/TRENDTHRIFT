import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '@/services/admin'
import type { AdminSettings } from '@/types'

const fields: [keyof AdminSettings, string][] = [
  ['store_name', 'Store name'],
  ['whatsapp_number', 'WhatsApp number (e.g. 254712345678)'],
  ['store_description', 'Store description'],
  ['instagram_url', 'Instagram URL'],
  ['tiktok_url', 'TikTok URL'],
  ['facebook_url', 'Facebook URL'],
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings().then(setSettings) }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    await updateSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!settings) return <p className="text-white/50">Loading...</p>

  return (
    <div>
      <h1 className="font-display text-2xl">Settings</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-white/10 p-6">
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-sm text-white/60">{label}</label>
            <input
              value={(settings[key] as string) ?? ''}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40"
            />
          </div>
        ))}

        <button type="submit" className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black">
          {saved ? 'Saved' : 'Save settings'}
        </button>
      </form>
    </div>
  )
}
