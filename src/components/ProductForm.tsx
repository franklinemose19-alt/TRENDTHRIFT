import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadProductImage } from '@/services/admin'
import type { Product, ProductStatus } from '@/types'

interface Props {
  initial?: Partial<Product>
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  submitLabel: string
}

const categories = ['Jackets', 'Jeans', 'Shirts', 'T-Shirts', 'Pants', 'Other']
const conditions = ['Excellent', 'Good', 'Fair']

export default function ProductForm({ initial, onSubmit, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [category, setCategory] = useState(initial?.category ?? categories[0])
  const [size, setSize] = useState(initial?.size ?? '')
  const [condition, setCondition] = useState(initial?.condition ?? conditions[0])
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? 'available')
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(uploadProductImage))
      setImages((prev) => [...prev, ...urls])
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({
        name,
        price: Number(price),
        category,
        size,
        condition,
        description: description || null,
        images,
        status,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Price (KSh)">
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Size">
          <input value={size} onChange={(e) => setSize(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Condition">
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputCls}>
            {conditions.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Availability">
          <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={inputCls}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
      </Field>

      <Field label="Images">
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative h-20 w-20">
              <img src={url} className="h-full w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 rounded-full bg-black p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/25 text-white/50 hover:border-white/50">
            {uploading ? '…' : <Upload size={18} />}
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        </div>
      </Field>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black disabled:opacity-50"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

const inputCls = 'w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/60">{label}</label>
      {children}
    </div>
  )
}
