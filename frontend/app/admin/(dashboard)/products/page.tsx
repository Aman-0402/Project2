'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { ROUTES } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import { ConfirmModal } from '@/components/ui/Modal'
import NeoToggle from '@/components/admin/NeoToggle'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all')
  const [toggling, setToggling] = useState<Record<string, boolean>>({})

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    const res = await productService.adminGetAll()
    if (res.success && res.data) setProducts(res.data)
    setIsLoading(false)
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const res = await productService.adminDelete(deleteTarget.id)
    setIsDeleting(false)
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      setError('Failed to delete product.')
    }
  }

  async function handleToggle(
    productId: number,
    field: 'is_active' | 'is_featured',
    value: boolean
  ) {
    const key = `${productId}-${field}`
    if (toggling[key]) return
    setToggling((prev) => ({ ...prev, [key]: true }))

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p))
    )

    const res = await productService.adminUpdate(productId, { [field]: value })
    if (!res.success) {
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, [field]: !value } : p))
      )
      setError(`Failed to update ${field === 'is_active' ? 'status' : 'featured'}.`)
    }
    setToggling((prev) => ({ ...prev, [key]: false }))
  }

  const filtered = useMemo(() => {
    let result = products
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'active') result = result.filter((p) => p.is_active)
    if (statusFilter === 'inactive') result = result.filter((p) => !p.is_active)
    if (statusFilter === 'featured') result = result.filter((p) => p.is_featured)
    return result
  }, [products, search, statusFilter])

  const STATUS_FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'featured', label: 'Featured' },
  ] as const

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="label-luxury mb-1">Manage</p>
          <h1 className="font-serif text-3xl text-brown">Products</h1>
        </div>
        <Link
          href={ROUTES.adminProductNew}
          className="inline-flex items-center gap-2 bg-gold text-ivory px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30 pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ivory border border-beige-dark pl-9 pr-4 py-2 text-sm font-sans text-brown placeholder-brown/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 text-[10px] font-sans uppercase tracking-luxury border transition-colors duration-200 ${
                statusFilter === f.value
                  ? 'bg-brown text-ivory border-brown'
                  : 'text-brown/45 border-beige-dark hover:border-gold hover:text-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-xs font-sans bg-red-50 border border-red-100 px-4 py-2 mb-4">{error}</p>
      )}

      {/* Table */}
      <div className="bg-ivory border border-beige-dark overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            {products.length === 0 ? (
              <>
                <p className="font-sans text-sm text-brown/50 mb-3">No products found.</p>
                <Link href={ROUTES.adminProductNew} className="text-gold text-xs font-sans hover:text-gold-dark">
                  Create your first product &rarr;
                </Link>
              </>
            ) : (
              <p className="font-sans text-sm text-brown/50">No products match your filter.</p>
            )}
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-beige-dark bg-beige/30 flex items-center justify-between">
              <p className="font-sans text-[10px] text-brown/40 uppercase tracking-luxury">
                {filtered.length} of {products.length} products
              </p>
              <p className="font-sans text-[9px] text-brown/25 uppercase tracking-luxury hidden sm:block">
                Toggle to change status instantly
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige-dark bg-beige/20">
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Product</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px] hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Price</th>
                  <th className="text-center px-4 py-3 label-luxury text-[10px]">Active</th>
                  <th className="text-center px-4 py-3 label-luxury text-[10px]">Featured</th>
                  <th className="text-right px-5 py-3 label-luxury text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    className="border-b border-beige/50 last:border-0 hover:bg-beige/25 transition-colors group"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <div className="w-11 h-11 relative flex-shrink-0 overflow-hidden border border-beige-dark">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 bg-beige flex-shrink-0 flex items-center justify-center border border-beige-dark">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-4 h-4 text-brown/20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-sans text-sm text-brown font-medium truncate max-w-[200px]">{product.name}</p>
                          {product.volume && (
                            <p className="font-sans text-xs text-brown/35 mt-0.5">{product.volume}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 font-sans text-sm text-brown/55 hidden md:table-cell">
                      {product.category?.name ?? <span className="text-brown/25">—</span>}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-sans text-sm text-brown font-medium whitespace-nowrap">
                      {formatPrice(product.price)}
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-4 text-center">
                      <div className="neo-toggle-cell flex justify-center">
                        <NeoToggle
                          id={`active-${product.id}`}
                          checked={product.is_active}
                          onChange={(val) => handleToggle(product.id, 'is_active', val)}
                          variant="active"
                          disabled={!!toggling[`${product.id}-is_active`]}
                        />
                      </div>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-4 text-center">
                      <div className="neo-toggle-cell flex justify-center">
                        <NeoToggle
                          id={`featured-${product.id}`}
                          checked={product.is_featured}
                          onChange={(val) => handleToggle(product.id, 'is_featured', val)}
                          variant="featured"
                          disabled={!!toggling[`${product.id}-is_featured`]}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={ROUTES.adminProductEdit(product.id)}
                          className="text-brown/40 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="text-brown/40 hover:text-red-500 text-xs font-sans uppercase tracking-luxury transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
