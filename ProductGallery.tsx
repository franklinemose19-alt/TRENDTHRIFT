import { useState } from 'react'

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="aspect-[3/4] overflow-hidden bg-ink/5">
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={'h-16 w-16 overflow-hidden rounded-md border-2 ' + (i === active ? 'border-ink' : 'border-transparent opacity-70')}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
