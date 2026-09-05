import { useEffect, useState } from 'react'
import { fetchSettings } from '@/services/admin'
import type { AdminSettings } from '@/types'

export function useSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
  }, [])

  return settings
}
