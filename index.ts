export type ProductStatus = 'available' | 'sold' | 'draft'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  size: string
  condition: string
  description: string | null
  images: string[]
  status: ProductStatus
  created_at: string
  updated_at: string
}

export interface ProductWithStats extends Product {
  view_count: number
  like_count: number
  whatsapp_click_count: number
  liked_by_visitor?: boolean
}

export interface AdminSettings {
  store_name: string
  whatsapp_number: string
  store_description: string
  instagram_url: string | null
  tiktok_url: string | null
  facebook_url: string | null
  updated_at: string
}

export type SortOption = 'newest' | 'most_viewed' | 'most_liked' | 'price_low' | 'price_high'

export interface OverviewStats {
  totalProducts: number
  totalViews: number
  totalLikes: number
  whatsappEnquiries: number
  availableProducts: number
  soldProducts: number
}
