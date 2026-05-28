import api from './api'
import type { ApiResponse, Product, ProductListItem, ProductFormData } from '@/types'

export const productService = {
  getAll: async (categorySlug?: string): Promise<ApiResponse<ProductListItem[]>> => {
    const params = categorySlug ? { category: categorySlug } : {}
    const { data } = await api.get('/products/', { params })
    return data
  },

  getFeatured: async (): Promise<ApiResponse<ProductListItem[]>> => {
    const { data } = await api.get('/products/featured/')
    return data
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const { data } = await api.get(`/products/${slug}/`)
    return data
  },

  // Admin
  adminGetAll: async (): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get('/admin/products/')
    return data
  },

  adminGetById: async (id: number): Promise<ApiResponse<Product>> => {
    const { data } = await api.get(`/admin/products/${id}/`)
    return data
  },

  adminCreate: async (formData: ProductFormData): Promise<ApiResponse<Product>> => {
    const { data } = await api.post('/admin/products/', formData)
    return data
  },

  adminUpdate: async (id: number, formData: Partial<ProductFormData>): Promise<ApiResponse<Product>> => {
    const { data } = await api.patch(`/admin/products/${id}/`, formData)
    return data
  },

  adminDelete: async (id: number): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/admin/products/${id}/`)
    return data
  },

  adminUploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await api.post('/admin/upload-image/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
