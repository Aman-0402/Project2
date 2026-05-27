export interface FragranceInquiry {
  id: number
  gender: string
  occasion: string
  notes: string[]
  intensity: string
  fragrance_name: string
  customer_name: string
  customer_phone: string
  customer_city: string
  additional_notes: string
  status: 'new' | 'contacted' | 'completed'
  created_at: string
}
