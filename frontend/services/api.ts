import axios from 'axios'
import Cookies from 'js-cookie'
import { CONFIG, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, COOKIE_OPTIONS_ACCESS, COOKIE_OPTIONS_REFRESH } from '@/constants/config'

const api = axios.create({
  baseURL: CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = Cookies.get(REFRESH_TOKEN_KEY)

      if (refresh) {
        try {
          const { data } = await axios.post(`${CONFIG.apiUrl}/auth/token/refresh/`, { refresh })
          const newAccess = data.access
          Cookies.set(AUTH_TOKEN_KEY, newAccess, COOKIE_OPTIONS_ACCESS)
          if (data.refresh) {
            Cookies.set(REFRESH_TOKEN_KEY, data.refresh, COOKIE_OPTIONS_REFRESH)
          }
          original.headers.Authorization = `Bearer ${newAccess}`
          return api(original)
        } catch {
          // Refresh failed — clear tokens
          Cookies.remove(AUTH_TOKEN_KEY)
          Cookies.remove(REFRESH_TOKEN_KEY)
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login'
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
