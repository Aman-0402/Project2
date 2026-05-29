import type { Category } from './category'

export interface FragranceNotes {
  top?: string[]
  middle?: string[]
  base?: string[]
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: string
  volume: string | null
  category: Category | null
  fragrance_notes: FragranceNotes
  image: string | null
  images: string[]
  is_featured: boolean
  is_active: boolean
  image_layer_effect: boolean
  created_at: string
  updated_at: string
}

export interface ProductListItem {
  id: number
  name: string
  slug: string
  price: string
  volume: string | null
  category: Category | null
  image: string | null
  images: string[]
  is_featured: boolean
  image_layer_effect: boolean
  created_at: string
}

export interface ProductFormData {
  name: string
  description: string
  price: string
  volume: string
  category: number | null
  fragrance_notes: FragranceNotes
  image: string
  images: string[]
  is_featured: boolean
  is_active: boolean
  image_layer_effect: boolean
}
