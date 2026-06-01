'use client'

import { useState } from 'react'
import api from '@/services/api'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function update(key: string, value: string) {
    setForm(p => ({ ...p, [key]: value }))
    if (status !== 'idle') setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) {
      setStatus('error')
      setMessage('New passwords do not match.')
      return
    }
    if (form.new_password.length < 8) {
      setStatus('error')
      setMessage('New password must be at least 8 characters.')
      return
    }
    setStatus('loading')
    try {
      const res = await api.post('/auth/change-password/', form)
      setStatus('success')
      setMessage(res.data.message || 'Password changed successfully.')
      setForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err: unknown) {
      setStatus('error')
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setMessage(msg || 'Failed to change password.')
    }
  }

  const fields = [
    { key: 'current_password',  label: 'Current Password',  placeholder: 'Enter current password'  },
    { key: 'new_password',      label: 'New Password',       placeholder: 'Min. 8 characters'        },
    { key: 'confirm_password',  label: 'Confirm New Password', placeholder: 'Repeat new password'   },
  ]

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <p className="label-luxury text-gold mb-2">Account</p>
        <h1 className="font-serif text-3xl text-brown">Change Password</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-ivory border border-beige-dark rounded-sm overflow-hidden">
        <div className="divide-y divide-beige-dark">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="px-6 py-5">
              <label className="block text-brown/45 text-[10px] font-sans uppercase tracking-luxury mb-2">
                {label}
              </label>
              <input
                type="password"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => update(key, e.target.value)}
                required
                autoComplete={key === 'current_password' ? 'current-password' : 'new-password'}
                className="w-full bg-transparent border-b border-beige-dark text-brown text-sm font-sans py-2 focus:outline-none focus:border-gold transition-colors placeholder-brown/20"
              />
            </div>
          ))}
        </div>

        {/* Status message */}
        {status !== 'idle' && (
          <div className={`px-6 py-3 text-xs font-sans ${
            status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {/* Submit */}
        <div className="px-6 py-5 border-t border-beige-dark">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gold text-brown text-xs font-sans uppercase tracking-luxury px-8 py-3 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Saving...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}
