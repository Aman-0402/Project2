'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import { categoryService } from '@/services/categories'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Category } from '@/types'

interface CategoryForm {
  name: string
  description: string
}

const EMPTY_FORM: CategoryForm = { name: '', description: '' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const loadCategories = useCallback(async () => {
    setIsLoading(true)
    const res = await categoryService.getAll()
    if (res.success && res.data) setCategories(res.data)
    setIsLoading(false)
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  function startEdit(cat: Category) {
    setEditTarget(cat)
    setForm({ name: cat.name, description: cat.description ?? '' })
    setFormError('')
  }

  function cancelEdit() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Category name is required.'); return }
    setFormError('')
    setIsSubmitting(true)

    if (editTarget) {
      const res = await categoryService.adminUpdate(editTarget.id, form)
      if (res.success && res.data) {
        setCategories((prev) => prev.map((c) => c.id === editTarget.id ? res.data! : c))
        cancelEdit()
      } else {
        setFormError(res.message || 'Update failed.')
      }
    } else {
      const res = await categoryService.adminCreate(form)
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data!])
        setForm(EMPTY_FORM)
      } else {
        setFormError(res.message || 'Create failed.')
      }
    }
    setIsSubmitting(false)
  }

  async function handleDelete(cat: Category) {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: `"${cat.name}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    const res = await categoryService.adminDelete(cat.id)
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      Swal.fire({ title: 'Deleted!', text: `"${cat.name}" has been removed.`, icon: 'success', timer: 2000, showConfirmButton: false })
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin" className="text-brown/40 hover:text-gold transition-colors text-xs font-sans uppercase tracking-luxury inline-flex items-center gap-1.5 mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Dashboard
        </Link>
        <p className="label-luxury mb-1">Manage</p>
        <h1 className="font-serif text-3xl text-brown">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-ivory border border-beige-dark p-6">
          <p className="label-luxury mb-5">
            {editTarget ? `Edit: ${editTarget.name}` : 'New Category'}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Oud"
              error={formError && !form.name.trim() ? formError : undefined}
            />
            <Textarea
              label="Description (optional)"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this fragrance category..."
              rows={3}
            />
            {formError && form.name.trim() && (
              <p className="text-red-600 text-xs font-sans">{formError}</p>
            )}
            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="flex-1">
                {editTarget ? 'Update' : 'Create'}
              </Button>
              {editTarget && (
                <Button type="button" variant="ghost" size="md" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Category list */}
        <div className="bg-ivory border border-beige-dark overflow-hidden">
          <div className="px-5 py-4 border-b border-beige-dark">
            <p className="label-luxury">All Categories ({categories.length})</p>
          </div>
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="p-6 font-sans text-sm text-brown/40 text-center">No categories yet.</p>
          ) : (
            <ul>
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.li
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center justify-between px-5 py-3.5 border-b border-beige/60 last:border-0 transition-colors ${editTarget?.id === cat.id ? 'bg-gold/5' : 'hover:bg-beige/20'}`}
                  >
                    <div>
                      <p className="font-sans text-sm text-brown font-medium">{cat.name}</p>
                      <p className="font-sans text-xs text-brown/40 mt-0.5">
                        {cat.product_count} product{cat.product_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="group/edit relative flex items-center justify-start w-[80px] h-9 px-3 bg-black text-white font-bold text-xs rounded-[10px] shadow-[4px_4px_0px_#000] overflow-hidden transition-all duration-300 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_#fff]"
                      >
                        <span className="transition-colors duration-300 group-hover/edit:text-transparent select-none">Edit</span>
                        <svg viewBox="0 0 512 512" className="absolute right-3 w-2.5 fill-white transition-all duration-300 group-hover/edit:left-1/2 group-hover/edit:-translate-x-1/2 group-hover/edit:right-auto">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        disabled={cat.product_count > 0}
                        title={cat.product_count > 0 ? 'Cannot delete category with products' : 'Delete category'}
                        className="group/delete relative flex items-center justify-start w-[80px] h-9 px-3 bg-red-700 text-white font-bold text-xs rounded-[10px] shadow-[4px_4px_0px_#7f1d1d] overflow-hidden transition-all duration-300 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_#fff] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        <span className="transition-colors duration-300 group-hover/delete:text-transparent select-none">Delete</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="absolute right-3 w-2.5 stroke-white transition-all duration-300 group-hover/delete:left-1/2 group-hover/delete:-translate-x-1/2 group-hover/delete:right-auto">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

    </div>
  )
}
