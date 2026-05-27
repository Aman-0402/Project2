'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { categoryService } from '@/services/categories'
import type { Category, ProductFormData } from '@/types'

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
  is_featured: false,
  is_active: true,
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
  const [noteInputs, setNoteInputs] = useState({
    top: initialData?.fragrance_notes?.top?.join(', ') ?? '',
    middle: initialData?.fragrance_notes?.middle?.join(', ') ?? '',
    base: initialData?.fragrance_notes?.base?.join(', ') ?? '',
  })
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

  function parseNotes(raw: string): string[] {
    return raw.split(',').map((s) => s.trim()).filter(Boolean)
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof ProductFormData, string>> = {}
    if (!form.name.trim()) errors.name = 'Product name is required.'
    if (!form.price || isNaN(parseFloat(form.price))) errors.price = 'Valid price is required.'
    if (parseFloat(form.price) < 0) errors.price = 'Price must be positive.'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload: ProductFormData = {
      ...form,
      fragrance_notes: {
        top: parseNotes(noteInputs.top),
        middle: parseNotes(noteInputs.middle),
        base: parseNotes(noteInputs.base),
      },
    }
    await onSubmit(payload)
  }

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
                  label="Price (USD)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="e.g. 150.00"
                  error={validationErrors.price}
                />
                <Input
                  label="Volume"
                  value={form.volume}
                  onChange={(e) => set('volume', e.target.value)}
                  placeholder="e.g. 50ml"
                />
              </div>
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-2">Fragrance Notes</p>
            <p className="font-sans text-xs text-brown/40 mb-5">Comma-separated values (e.g. Bergamot, Lemon)</p>
            <div className="flex flex-col gap-4">
              <Input
                label="Top Notes"
                value={noteInputs.top}
                onChange={(e) => setNoteInputs((prev) => ({ ...prev, top: e.target.value }))}
                placeholder="e.g. Bergamot, Grapefruit, Lemon"
              />
              <Input
                label="Middle Notes"
                value={noteInputs.middle}
                onChange={(e) => setNoteInputs((prev) => ({ ...prev, middle: e.target.value }))}
                placeholder="e.g. Rose, Jasmine, Oud"
              />
              <Input
                label="Base Notes"
                value={noteInputs.base}
                onChange={(e) => setNoteInputs((prev) => ({ ...prev, base: e.target.value }))}
                placeholder="e.g. Musk, Amber, Sandalwood"
              />
            </div>
          </div>
        </div>

        {/* Sidebar — right col */}
        <div className="flex flex-col gap-5">
          {/* Image */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-4">Product Image</p>
            {form.image && (
              <div className="relative w-full aspect-square mb-4 bg-beige overflow-hidden">
                <Image src={form.image} alt="Product preview" fill className="object-cover" sizes="300px" />
              </div>
            )}
            <Input
              label="Image URL"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              hint="Paste Cloudinary URL after uploading image"
            />
          </div>

          {/* Category */}
          <div className="bg-ivory border border-beige-dark p-6">
            <p className="label-luxury mb-4">Category</p>
            <div className="flex flex-col gap-1.5">
              <label className="label-luxury text-[10px]">Select Category</label>
              <select
                value={form.category ?? ''}
                onChange={(e) => set('category', e.target.value ? Number(e.target.value) : null)}
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
