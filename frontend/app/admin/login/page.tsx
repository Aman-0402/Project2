'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CONFIG } from '@/constants/config'

function AdminLoginContent() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.')
      return
    }
    setIsSubmitting(true)
    const result = await login({ username, password })
    setIsSubmitting(false)
    if (result.success) {
      router.replace(from)
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brown flex items-center justify-center p-4">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-dot-pattern" />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-gold text-xs font-sans uppercase tracking-wide-luxury mb-2">
              Admin Portal
            </p>
            <h1 className="font-serif text-3xl text-ivory tracking-wide">
              {CONFIG.brandName}
            </h1>
            <div className="w-12 h-px bg-gold mx-auto mt-4" />
          </motion.div>
        </div>

        {/* Login card */}
        <motion.div
          className="bg-ivory p-8 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />

            {error && (
              <motion.p
                className="text-red-600 text-xs font-sans text-center bg-red-50 border border-red-100 px-4 py-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </motion.div>

        <p className="text-center text-ivory/30 text-xs font-sans mt-6 tracking-luxury uppercase">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brown flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  )
}
