'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { categoryService } from '@/services/categories'
import { productService } from '@/services/products'
import type { Category, ProductFormData } from '@/types'

// ─── Fragrance note suggestions per layer ────────────────────────────────────

const NOTE_SUGGESTIONS = {
  top: [
    'Bergamot', 'Lemon', 'Grapefruit', 'Orange', 'Lime', 'Mandarin', 'Neroli',
    'Petitgrain', 'Peppermint', 'Eucalyptus', 'Basil', 'Green Tea', 'Black Pepper',
    'Cardamom', 'Coriander', 'Aldehydes', 'Ginger', 'Rosemary',
  ],
  middle: [
    'Rose', 'Jasmine', 'Iris', 'Violet', 'Geranium', 'Ylang Ylang', 'Lily',
    'Peony', 'Lavender', 'Cloves', 'Cinnamon', 'Nutmeg', 'Oud', 'Sandalwood',
    'Cedar', 'Patchouli', 'Orris', 'Tuberose', 'Magnolia', 'Heliotrope',
    'Carnation', 'Mimosa', 'Muguet',
  ],
  base: [
    'Musk', 'Amber', 'Sandalwood', 'Vetiver', 'Oud', 'Benzoin', 'Vanilla',
    'Tonka Bean', 'Labdanum', 'Patchouli', 'Cedar', 'Oakmoss', 'Ambergris',
    'Incense', 'Leather', 'Frankincense', 'Myrrh', 'Guaiac Wood', 'Castoreum',
    'Civet', 'Balsam', 'Cistus',
  ],
} as const

type NoteLayer = keyof typeof NOTE_SUGGESTIONS

// ─── TagInput ─────────────────────────────────────────────────────────────────

function TagInput({
  label,
  tags,
  onChange,
  layer,
}: {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  layer: NoteLayer
}) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = NOTE_SUGGESTIONS[layer]
  const filtered = input.trim()
    ? suggestions.filter(
        (s) =>
          s.toLowerCase().includes(input.toLowerCase()) &&
          !tags.map((t) => t.toLowerCase()).includes(s.toLowerCase())
      )
    : suggestions
        .filter((s) => !tags.map((t) => t.toLowerCase()).includes(s.toLowerCase()))
        .slice(0, 8)

  function addTag(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    if (!tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      onChange([...tags, trimmed])
    }
    setInput('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1])
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="relative">
      <label className="label-luxury text-[10px] block mb-2">{label}</label>

      {/* Tag container */}
      <div
        className="bg-ivory border border-beige-dark min-h-[44px] px-2.5 py-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:border-gold transition-colors duration-200"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-gold/10 border border-gold/30 text-gold-dark text-xs font-sans px-2 py-0.5"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="text-gold/50 hover:text-red-500 leading-none transition-colors"
              tabIndex={-1}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Type or pick from suggestions…' : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none font-sans text-sm text-brown placeholder-brown/25"
        />
      </div>

      {/* Hint */}
      <p className="text-[9px] font-sans text-brown/30 mt-1 uppercase tracking-luxury">
        Press Enter or comma to add · Backspace to remove last
      </p>

      {/* Suggestions dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-30 bg-ivory border border-beige-dark mt-0.5 shadow-lg max-h-44 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[9px] font-sans text-brown/35 uppercase tracking-luxury border-b border-beige-dark">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5 p-2.5">
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(s) }}
                className="px-2.5 py-1 text-[11px] font-sans text-brown/70 border border-beige-dark hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-150"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ImageSlot ────────────────────────────────────────────────────────────────

function ImageSlot({
  url,
  index,
  onUpload,
  onRemove,
}: {
  url: string | null
  index: number
  onUpload: (file: File) => Promise<void>
  onRemove: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setErr('Must be an image')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErr('Max 2 MB')
      return
    }

    setErr('')
    setUploading(true)
    try {
      await onUpload(file)
    } catch {
      setErr('Upload failed')
    }
    setUploading(false)
  }

  return (
    <div>
      <div className="aspect-square relative overflow-hidden">
        {url ? (
          <div className="w-full h-full relative group">
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
              sizes="160px"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-brown/80 text-ivory text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Remove image"
            >
              ×
            </button>
            {/* Primary badge */}
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 text-[8px] font-sans uppercase tracking-luxury bg-gold text-ivory px-1.5 py-0.5">
                Primary
              </span>
            )}
          </div>
        ) : (
          <label
            className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-all ${
              uploading
                ? 'border-gold/40 bg-gold/5'
                : 'border-beige-dark hover:border-gold hover:bg-gold/5'
            }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="w-7 h-7 text-brown/20 mb-1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span className="text-[9px] font-sans text-brown/30 uppercase tracking-luxury text-center leading-tight">
                  {index === 0 ? 'Upload photo' : 'Add photo'}
                  <br />
                  <span className="text-brown/20">3:4 · max 2 MB</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  className="sr-only"
                  disabled={uploading}
                />
              </>
            )}
          </label>
        )}
      </div>
      {err && (
        <p className="text-[9px] text-red-500 font-sans mt-1 text-center">{err}</p>
      )}
    </div>
  )
}

// ─── ProductForm ──────────────────────────────────────────────────────────────

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
  isSubmitting: boolean
  submitLabel?: string
  error?: string
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  description: '',
  price: '',
  volume: '',
  category: null,
  fragrance_notes: { top: [], middle: [], base: [] },
  image: '',
  images: [],
  is_featured: false,
  is_active: true,
  image_layer_effect: true,
}

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save Product',
  error,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({ ...EMPTY_FORM, ...initialData })
  const [categories, setCategories] = useState<Category[]>([])
  const [fragranceNotes, setFragranceNotes] = useState({
    top: initialData?.fragrance_notes?.top ?? [],
    middle: initialData?.fragrance_notes?.middle ?? [],
    base: initialData?.fragrance_notes?.base ?? [],
  })
  const [images, setImages] = useState<string[]>(
    initialData?.images?.length
      ? initialData.images
      : initialData?.image
      ? [initialData.image]
      : []
  )
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.success && res.data) setCategories(res.data)
    })
  }, [])

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setValidationErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleImageUpload(index: number, file: File) {
    const res = await productService.adminUploadImage(file)
    if (!res.success || !res.data?.url) throw new Error(res.message || 'Upload failed')
    setImages((prev) => {
      const next = [...prev]
      next[index] = res.data!.url
      return next
    })
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof ProductFormData, string>> = {}
    if (!form.name.trim()) errors.name = 'Product name is required.'
    if (!form.price || isNaN(parseFloat(form.price))) errors.price = 'Valid price is required.'
    if (parseFloat(form.price) < 0) errors.price = 'Price must be positive.'
    if (images.length === 0) errors.images = 'At least 1 image is required.'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // Strip __custom__ placeholder, clean up and sort volumes numerically
    const cleanVolume = (form.volume ?? '')
      .split(',').map(s => s.trim()).filter(s => s && s !== '__custom__')
      .sort((a, b) => (parseFloat(a) || Infinity) - (parseFloat(b) || Infinity))
      .join(', ')
    await onSubmit({
      ...form,
      volume: cleanVolume,
      fragrance_notes: {
        top: fragranceNotes.top,
        middle: fragranceNotes.middle,
        base: fragranceNotes.base,
      },
      images,
      image: images[0] ?? '',
    })
  }

  // 4 fixed slots (filled + empty)
  const slots = Array.from({ length: 4 }, (_, i) => images[i] ?? null)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main fields — left 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-5">Product Details</p>
            <div className="flex flex-col gap-4">
              <Input
                label="Product Name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Royal Oudh"
                error={validationErrors.name}
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe the fragrance, its story, and character..."
                rows={5}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="e.g. 1500"
                  error={validationErrors.price}
                />
                <div>
                  <label className="label-luxury block mb-1.5">Volume</label>
                  {(() => {
                    const PRESETS = ['10ml', '30ml', '50ml', '100ml']
                    // Parse current value into array
                    const current = (form.volume ?? '').split(',').map(s => s.trim()).filter(Boolean)
                    const selectedPresets = current.filter(v => PRESETS.includes(v))
                    const customVals = current.filter(v => !PRESETS.includes(v))
                    const showCustomInput = customVals.length > 0 || current.includes('__custom__')

                    const togglePreset = (val: string) => {
                      const next = selectedPresets.includes(val)
                        ? selectedPresets.filter(v => v !== val)
                        : [...selectedPresets, val]
                      set('volume', [...next, ...customVals].join(', '))
                    }
                    const setCustom = (val: string) => {
                      set('volume', [...selectedPresets, ...(val ? [val] : [])].join(', '))
                    }

                    return (
                      <>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {PRESETS.map((opt) => {
                            const active = selectedPresets.includes(opt)
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => togglePreset(opt)}
                                className={`px-3 py-1.5 text-xs font-sans border transition-colors duration-150 flex items-center gap-1.5 ${
                                  active
                                    ? 'bg-brown text-ivory border-brown'
                                    : 'bg-ivory text-brown/55 border-beige-dark hover:border-gold hover:text-gold'
                                }`}
                              >
                                {active && (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-2.5 h-2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                                {opt}
                              </button>
                            )
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              if (customVals.length > 0) setCustom('')
                              else set('volume', [...selectedPresets, '__custom__'].join(', '))
                            }}
                            className={`px-3 py-1.5 text-xs font-sans border transition-colors duration-150 flex items-center gap-1.5 ${
                              showCustomInput
                                ? 'bg-brown text-ivory border-brown'
                                : 'bg-ivory text-brown/55 border-beige-dark hover:border-gold hover:text-gold'
                            }`}
                          >
                            {showCustomInput && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-2.5 h-2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                            Custom
                          </button>
                        </div>
                        {showCustomInput && (
                          <input
                            type="text"
                            value={customVals.join(', ')}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="e.g. 75ml or 200ml, 500ml"
                            className="w-full bg-ivory border border-beige-dark px-4 py-2.5 font-sans text-sm text-brown placeholder-brown/30 focus:outline-none focus:border-gold transition-colors"
                            autoFocus
                          />
                        )}
                        {current.length > 0 && (
                          <p className="text-[10px] font-sans text-brown/35 mt-1.5">
                            Selected: {current.filter(v => v !== '__custom__').join(' · ') || '—'}
                          </p>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Fragrance Notes — TagInput */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-1">Fragrance Notes</p>
            <p className="font-sans text-xs text-brown/40 mb-5">
              Type a note and press Enter, or pick from suggestions
            </p>
            <div className="flex flex-col gap-6">
              <TagInput
                label="Top Notes — first impression (15–30 min)"
                tags={fragranceNotes.top}
                onChange={(tags) => setFragranceNotes((prev) => ({ ...prev, top: tags }))}
                layer="top"
              />
              <TagInput
                label="Middle / Heart Notes — core character (30 min – 4 hrs)"
                tags={fragranceNotes.middle}
                onChange={(tags) => setFragranceNotes((prev) => ({ ...prev, middle: tags }))}
                layer="middle"
              />
              <TagInput
                label="Base Notes — lasting dry-down (4+ hrs)"
                tags={fragranceNotes.base}
                onChange={(tags) => setFragranceNotes((prev) => ({ ...prev, base: tags }))}
                layer="base"
              />
            </div>
          </div>
        </div>

        {/* Sidebar — right col */}
        <div className="flex flex-col gap-5">

          {/* Multi-image upload */}
          <div className="bg-ivory border border-beige-dark p-6">
            <div className="flex items-start justify-between mb-1">
              <p className="label-luxury">Product Images</p>
              <span className="text-[9px] font-sans text-brown/35 uppercase tracking-luxury">
                {images.length}/4
              </span>
            </div>
            <p className="font-sans text-xs text-brown/40 mb-4">
              Min 1 · Max 4 · 2 MB each · First is primary
            </p>
            <p className="font-sans text-[10px] text-gold/70 bg-gold/8 border border-gold/20 px-3 py-2 mb-4 leading-snug">
              Use <strong>3:4 portrait ratio</strong> (e.g. 900×1200px) for best display. Landscape images will be cropped.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {slots.map((url, i) => (
                <ImageSlot
                  key={i}
                  url={url}
                  index={i}
                  onUpload={(file) => handleImageUpload(i, file)}
                  onRemove={() => removeImage(i)}
                />
              ))}
            </div>

            {validationErrors.images && (
              <p className="text-red-500 text-xs font-sans mt-3">{validationErrors.images}</p>
            )}
          </div>

          {/* Category */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-4">Category</p>
            <div className="flex flex-col gap-1.5">
              <label className="label-luxury text-[10px]">Select Category</label>
              <select
                value={form.category ?? ''}
                onChange={(e) => set('category', e.target.value ? Number(e.target.value) : null)}
                title="Product category"
                aria-label="Product category"
                className="w-full bg-ivory border border-beige-dark px-4 py-3 font-sans text-sm text-brown focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors duration-200"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-4">Visibility</p>
            <div className="flex flex-col gap-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-sans text-sm text-brown">Active</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  onClick={() => set('is_active', !form.is_active)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${form.is_active ? 'bg-gold' : 'bg-beige-dark'}`}
                >
                  <motion.span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ x: form.is_active ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-sans text-sm text-brown">Featured</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_featured}
                  onClick={() => set('is_featured', !form.is_featured)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${form.is_featured ? 'bg-gold' : 'bg-beige-dark'}`}
                >
                  <motion.span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ x: form.is_featured ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-sans text-sm text-brown block">Image Layer Effect</span>
                  <span className="font-sans text-xs text-brown/40">Overlay bottle (image 1) on background (image 2)</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.image_layer_effect}
                  onClick={() => set('image_layer_effect', !form.image_layer_effect)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${form.image_layer_effect ? 'bg-gold' : 'bg-beige-dark'}`}
                >
                  <motion.span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ x: form.image_layer_effect ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            {error && (
              <p className="text-red-600 text-xs font-sans bg-red-50 border border-red-100 px-4 py-2 text-center">
                {error}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
