'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ROUTES } from '@/constants/config'

export default function AdminProfilePage() {
  const { user } = useAuth()

  const fields = [
    { label: 'Username',    value: user?.username ?? '—' },
    { label: 'Email',       value: user?.email    ?? '—' },
    { label: 'Role',        value: user?.is_staff ? 'Administrator' : 'Staff' },
    { label: 'Account',     value: 'Active' },
  ]

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <p className="label-luxury text-gold mb-2">Account</p>
        <h1 className="font-serif text-3xl text-brown">Profile</h1>
      </div>

      <div className="bg-ivory border border-beige-dark rounded-sm overflow-hidden mb-6">
        {/* Avatar row */}
        <div className="px-6 py-6 border-b border-beige-dark flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-gold text-xl font-medium">
              {user?.username?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div>
            <p className="font-serif text-brown text-lg leading-tight">{user?.username}</p>
            <p className="text-brown/40 text-xs font-sans uppercase tracking-luxury mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-beige-dark">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <p className="text-brown/45 text-xs font-sans uppercase tracking-luxury">{label}</p>
              <p className="text-brown text-sm font-sans">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={ROUTES.adminChangePassword}
        className="inline-flex items-center gap-2 bg-gold text-brown text-xs font-sans uppercase tracking-luxury px-6 py-3 hover:bg-gold-light transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Change Password
      </Link>
    </div>
  )
}
