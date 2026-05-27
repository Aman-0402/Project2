'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { authService } from '@/services/auth'
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, ROUTES } from '@/constants/config'
import type { AdminUser, LoginCredentials } from '@/types'
import { useRouter } from 'next/navigation'

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Hydrate user from stored token on mount
  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_KEY)
    if (token) {
      authService.getMe()
        .then((res) => {
          if (res.success && res.data) setUser(res.data)
        })
        .catch(() => {
          Cookies.remove(AUTH_TOKEN_KEY)
          Cookies.remove(REFRESH_TOKEN_KEY)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await authService.login(credentials)
      if (res.success && res.data) {
        Cookies.set(AUTH_TOKEN_KEY, res.data.access, { expires: 1 / 24, sameSite: 'strict' })
        Cookies.set(REFRESH_TOKEN_KEY, res.data.refresh, { expires: 7, sameSite: 'strict' })
        setUser(res.data.user)
        return { success: true }
      }
      return { success: false, error: res.message || 'Login failed.' }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || 'Login failed.'
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    const refresh = Cookies.get(REFRESH_TOKEN_KEY)
    if (refresh) {
      try { await authService.logout(refresh) } catch { /* ignore */ }
    }
    Cookies.remove(AUTH_TOKEN_KEY)
    Cookies.remove(REFRESH_TOKEN_KEY)
    setUser(null)
    router.push(ROUTES.adminLogin)
  }, [router])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
