import api from './api'
import type { ApiResponse } from '@/types'

export const settingsService = {
  getAll: async (): Promise<ApiResponse<Record<string, string>>> => {
    const res = await api.get('/settings/')
    return res.data
  },

  adminUpdate: async (settings: Record<string, string>): Promise<ApiResponse<unknown>> => {
    const res = await api.put('/admin/settings/', { settings })
    return res.data
  },
}
