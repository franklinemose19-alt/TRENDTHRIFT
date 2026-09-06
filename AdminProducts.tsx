import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Database } from 'lucide-react'
import { fetchProductsWithStats } from '@/services/products'
import { createProduct, updateProduct, deleteProduct } from '@/services/admin'
import ProductForm from '@/components/ProductForm'
import { seedSampleProducts } from '@/utils/seed'
import type { Product, ProductWithStats } from '@/types'

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [seeding, setSeeding] = useState(false)

  async function load() {
    setLoading(true)
    const data = await fetchProductsWithStats()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    await createProduct(data)
    setEditing(null)
    load()
  }

  async function handleUpdate(id: string, data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    await updateProduct(id, data)
    setEditing(null)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await deleteProduct(id)
    load()
  }

  async function handleMarkSold(product: ProductWithStats) {
    await updateProduct(product.id, { status: product.status === 'sold' ? 'available' : 'sold' })
    load()
  }

  async function handleSeed() {
    setSeeding(true)
    await seedSampleProducts()
    await load()
    setSeeding(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <div className="flex gap-2">
          {products.length === 0 && !loading && (
            <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm">
              <Database size={16} /> {seeding ? 'Seeding...' : 'Seed sample products'}
            </button>
          )}
          <button onClick={() => setEditing('new')} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
            <Plus size={16} /> Add product
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm text-white/60">{editing === 'new' ? 'New product' : 'Edit product'}</h2>
            <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white"><X size={18} /></button>
          </div>
          <ProductForm
            initial={editing === 'new' ? undefined : editing}
            submitLabel={editing === 'new' ? 'Publish' : 'Save changes'}
            onSubmit={(data) => (editing === 'new' ? handleCreate(data) : handleUpdate((editing as Product).id, data))}
          />
        </div>
      )}

      <div className="mt-8 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
            <img src={p.images[0]} className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-white/50">
                KSh {p.price.toLocaleString()} - {p.status} - {p.view_count} views - {p.like_count} likes
              </p>
            </div>
            <button onClick={() => handleMarkSold(p)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">
              {p.status === 'sold' ? 'Mark available' : 'Mark sold'}
            </button>
            <button onClick={() => setEditing(p)} className="text-white/60 hover:text-white"><Pencil size={16} /></button>
            <button onClick={() => handleDelete(p.id)} className="text-white/60 hover:text-red-400"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
