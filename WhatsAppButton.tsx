import { MessageCircle } from 'lucide-react'
import { recordWhatsAppClick, buildWhatsAppLink } from '@/services/products'
import type { Product } from '@/types'

interface Props {
  product: Pick<Product, 'id' | 'name' | 'price'>
  whatsappNumber: string
  full?: boolean
}

export default function WhatsAppButton({ product, whatsappNumber, full }: Props) {
  async function handleClick() {
    await recordWhatsAppClick(product.id)
    window.open(buildWhatsAppLink(whatsappNumber, product), '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={'inline-flex items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02] active:scale-[0.98] ' + (full ? 'w-full' : '')}
    >
      <MessageCircle size={18} />
      Order on WhatsApp
    </button>
  )
}
