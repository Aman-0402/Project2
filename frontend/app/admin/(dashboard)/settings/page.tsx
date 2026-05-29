'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { settingsService } from '@/services/settings'

interface SettingField {
  key: string
  label: string
  description: string
  type: 'text' | 'textarea' | 'tel'
  placeholder: string
}

interface ToggleField {
  key: string
  label: string
  description: string
}

const TOGGLE_FIELDS: ToggleField[] = [
  {
    key: 'image_layer_effect',
    label: 'Product Image Layer Effect',
    description: 'Composite bottle (image 1, PNG) over background (image 2) on product pages with hover zoom',
  },
]

const FIELDS: SettingField[] = [
  {
    key: 'brand_name',
    label: 'Brand Name',
    description: 'Displayed in the navbar and throughout the site',
    type: 'text',
    placeholder: 'M.M ATTARWALA',
  },
  {
    key: 'tagline',
    label: 'Tagline',
    description: 'Short line shown under the brand name in navbar',
    type: 'text',
    placeholder: 'The Art of Scent',
  },
  {
    key: 'whatsapp_number',
    label: 'WhatsApp Number',
    description: 'Used for all WhatsApp CTAs on the site (include country code)',
    type: 'tel',
    placeholder: '+919724586101',
  },
  {
    key: 'hero_headline',
    label: 'Hero Headline',
    description: 'Main heading shown on the homepage hero section',
    type: 'text',
    placeholder: 'The Essence of Paradise',
  },
  {
    key: 'hero_subheadline',
    label: 'Hero Subheadline',
    description: 'Supporting text below the hero headline',
    type: 'text',
    placeholder: 'Traditional Indian attars, perfumes & agarbatti...',
  },
  {
    key: 'about_text',
    label: 'About Text',
    description: 'Brand story text shown on the About page',
    type: 'textarea',
    placeholder: 'Tell your brand story...',
  },
]

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    settingsService.getAll().then((res) => {
      if (res.success && res.data) setValues(res.data)
    }).finally(() => setIsLoading(false))
  }, [])

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSaved(false)

    const res = await settingsService.adminUpdate(values)
    setIsSaving(false)

    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Failed to save settings. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="label-luxury mb-1">Configuration</p>
        <h1 className="font-serif text-3xl text-brown">Site Settings</h1>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} noValidate>
          <motion.div
            className="bg-ivory border border-beige-dark overflow-hidden mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            {FIELDS.map((field, i) => (
              <div
                key={field.key}
                className={`px-6 py-5 ${i < FIELDS.length - 1 ? 'border-b border-beige-dark' : ''}`}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={field.key}
                      className="font-sans text-sm text-brown font-medium block mb-0.5"
                    >
                      {field.label}
                    </label>
                    <p className="font-sans text-xs text-brown/40 mb-3">{field.description}</p>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.key}
                        rows={4}
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white border border-beige-dark px-3 py-2 text-sm font-sans text-brown placeholder-brown/25 focus:outline-none focus:border-gold transition-colors resize-none"
                      />
                    ) : (
                      <input
                        id={field.key}
                        type={field.type}
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white border border-beige-dark px-3 py-2 text-sm font-sans text-brown placeholder-brown/25 focus:outline-none focus:border-gold transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Feature toggles */}
          <motion.div
            className="bg-ivory border border-beige-dark overflow-hidden mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <div className="px-6 py-3 border-b border-beige-dark bg-beige/20">
              <p className="label-luxury text-[10px]">Feature Flags</p>
            </div>
            {TOGGLE_FIELDS.map((field) => {
              const enabled = values[field.key] !== 'false'
              return (
                <div key={field.key} className="px-6 py-5 flex items-center justify-between gap-6">
                  <div>
                    <p className="font-sans text-sm text-brown font-medium mb-0.5">{field.label}</p>
                    <p className="font-sans text-xs text-brown/40">{field.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    title={field.label}
                    aria-label={field.label}
                    onClick={() => handleChange(field.key, enabled ? 'false' : 'true')}
                    className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                      enabled ? 'bg-gold' : 'bg-beige-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-ivory rounded-full shadow transition-transform duration-300 ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </motion.div>

          {error && (
            <p className="text-red-600 text-xs font-sans bg-red-50 border border-red-100 px-4 py-2 mb-4">
              {error}
            </p>
          )}

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-gold text-ivory px-6 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border border-ivory/50 border-t-ivory rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>

            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-green-600 text-xs font-sans uppercase tracking-luxury"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Saved
              </motion.span>
            )}
          </motion.div>
        </form>
      )}
    </div>
  )
}
