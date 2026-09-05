import { useEffect, useState } from 'react'
import { fetchProductsWithStats } from '@/services/products'
import type { ProductWithStats } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<ProductWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProductsWithStats()
      .then((data) => { if (!cancelled) setProducts(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}
