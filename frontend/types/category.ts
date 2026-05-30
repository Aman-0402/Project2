export interface SubCategory {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  product_count: number
  subcategories: SubCategory[]
  created_at: string
}
