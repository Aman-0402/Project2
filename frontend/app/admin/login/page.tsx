import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <p className="label-luxury mb-4">Admin</p>
        <h1 className="font-serif text-3xl text-brown">Login</h1>
        <p className="font-sans text-brown/60 text-sm mt-4">Phase 4</p>
      </div>
    </div>
  )
}
