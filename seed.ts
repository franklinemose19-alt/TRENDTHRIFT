import { createProduct } from '@/services/admin'

const sample = [
  { name: 'Vintage Denim Jacket', price: 1500, category: 'Jackets', size: 'L', condition: 'Excellent', description: 'Classic 90s wash denim jacket, oversized fit, minimal wear.', images: ['https://images.unsplash.com/photo-1601333144130-8cbb312386b6'], status: 'available' as const },
  { name: 'Nike Windbreaker', price: 1800, category: 'Jackets', size: 'M', condition: 'Good', description: 'Retro Nike windbreaker in navy and red, lightly worn.', images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb'], status: 'available' as const },
  { name: "Levi's 501 Jeans", price: 1200, category: 'Jeans', size: '32', condition: 'Excellent', description: "True vintage Levi's 501, straight leg, great fade.", images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246'], status: 'available' as const },
  { name: 'Carhartt Jacket', price: 2200, category: 'Jackets', size: 'XL', condition: 'Good', description: 'Heavyweight Carhartt work jacket, faded duck canvas.', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5'], status: 'available' as const },
  { name: 'Vintage Polo Shirt', price: 700, category: 'Shirts', size: 'M', condition: 'Excellent', description: 'Soft cotton polo, subtle vintage branding.', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d'], status: 'available' as const },
  { name: 'Oversized Graphic Tee', price: 600, category: 'T-Shirts', size: 'L', condition: 'Good', description: 'Faded band graphic tee, oversized boxy fit.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'], status: 'available' as const },
  { name: 'Cargo Pants', price: 1400, category: 'Pants', size: '34', condition: 'Excellent', description: 'Utility cargo pants, multiple pockets, tapered fit.', images: ['https://images.unsplash.com/photo-1517438476312-10d79c077509'], status: 'available' as const },
  { name: 'Vintage Track Jacket', price: 1600, category: 'Jackets', size: 'M', condition: 'Good', description: 'Retro three-stripe track jacket, bold colourblock.', images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9'], status: 'sold' as const },
]

export async function seedSampleProducts() {
  for (const p of sample) {
    await createProduct(p)
  }
}
