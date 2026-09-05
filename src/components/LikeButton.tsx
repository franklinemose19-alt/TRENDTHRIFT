import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleLike } from '@/services/products'

interface Props {
  productId: string
  liked: boolean
  count: number
}

export default function LikeButton({ productId, liked, count }: Props) {
  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(count)
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    const next = !isLiked
    setIsLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      await toggleLike(productId, isLiked)
    } catch {
      setIsLiked(!next)
      setLikeCount((c) => c + (next ? -1 : 1))
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition-colors hover:border-ink/30"
      aria-pressed={isLiked}
    >
      <Heart size={16} className={isLiked ? 'fill-rust text-rust' : 'text-stone'} />
      {likeCount}
    </button>
  )
}
