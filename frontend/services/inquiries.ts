import api from './api'

export interface InquiryPayload {
  gender: string
  occasion: string
  notes: string[]
  intensity: string
  fragrance_name: string
  customer_name: string
  customer_phone: string
  customer_city: string
  additional_notes: string
}

export const inquiryService = {
  async create(data: InquiryPayload) {
    const response = await api.post('/inquiries/', data)
    return response.data
  },

  async adminGetAll(status?: string) {
    const params = status ? { status } : {}
    const response = await api.get('/admin/inquiries/', { params })
    return response.data
  },

  async adminUpdateStatus(id: number, status: string) {
    const response = await api.patch(`/admin/inquiries/${id}/`, { status })
    return response.data
  },

  async adminDelete(id: number) {
    const response = await api.delete(`/admin/inquiries/${id}/`)
    return response.data
  },
}
