import api from './api'
import type { ApiResponse, Category } from '@/types'

export const categoryService = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories/')
    return data
  },

  adminCreate: async (payload: { name: string; description?: string }): Promise<ApiResponse<Category>> => {
    const { data } = await api.post('/categories/', payload)
    return data
  },

  adminUpdate: async (id: number, payload: { name: string; description?: string }): Promise<ApiResponse<Category>> => {
    const { data } = await api.put(`/admin/categories/${id}/`, payload)
    return data
  },

  adminDelete: async (id: number): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/admin/categories/${id}/`)
    return data
  },
}
