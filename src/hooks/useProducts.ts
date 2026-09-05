import { useEffect, useState } from 'react'
import { fetchProductById, recordView } from '@/services/products'
import type { ProductWithStats } from '@/types'

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<ProductWithStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    fetchProductById(id).then((data) => {
      if (cancelled) return
      setProduct(data)
      setLoading(false)
      if (data) recordView(id)
    })
    return () => { cancelled = true }
  }, [id])

  return { product, loading }
}
