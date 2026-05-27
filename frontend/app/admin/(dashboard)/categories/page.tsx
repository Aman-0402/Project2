'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { categoryService } from '@/services/categories'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
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
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const res = await categoryService.adminDelete(deleteTarget.id)
    setIsDeleting(false)
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEdit(cat)}
                        className="text-brown/40 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="text-brown/40 hover:text-red-500 text-xs font-sans uppercase tracking-luxury transition-colors"
                        disabled={cat.product_count > 0}
                        title={cat.product_count > 0 ? 'Cannot delete category with products' : ''}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Products in this category will be uncategorized.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
