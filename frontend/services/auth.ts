import api from './api'
import type { ApiResponse, AuthTokens, LoginCredentials } from '@/types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> => {
    const { data } = await api.post('/auth/login/', credentials)
    return data
  },

  logout: async (refresh: string): Promise<ApiResponse<null>> => {
    const { data } = await api.post('/auth/logout/', { refresh })
    return data
  },

  getMe: async (): Promise<ApiResponse<AuthTokens['user']>> => {
    const { data } = await api.get('/auth/me/')
    return data
  },

  refreshToken: async (refresh: string): Promise<{ access: string; refresh: string }> => {
    const { data } = await api.post('/auth/token/refresh/', { refresh })
    return data
  },
}
