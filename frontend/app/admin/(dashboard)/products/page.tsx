'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { ROUTES } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import { ConfirmModal } from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label-luxury mb-1">Manage</p>
          <h1 className="font-serif text-3xl text-brown">Products</h1>
        </div>
        <Link
          href={ROUTES.adminProductNew}
          className="inline-flex items-center gap-2 bg-gold text-ivory px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
        >
          + Add Product
        </Link>
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
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-sans text-sm text-brown/50 mb-3">No products found.</p>
            <Link href={ROUTES.adminProductNew} className="text-gold text-xs font-sans hover:text-gold-dark">
              Create your first product &rarr;
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige-dark bg-beige/40">
                <th className="text-left px-5 py-3 label-luxury text-[10px]">Product</th>
                <th className="text-left px-5 py-3 label-luxury text-[10px] hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3 label-luxury text-[10px]">Price</th>
                <th className="text-left px-5 py-3 label-luxury text-[10px] hidden lg:table-cell">Status</th>
                <th className="text-left px-5 py-3 label-luxury text-[10px] hidden lg:table-cell">Featured</th>
                <th className="text-right px-5 py-3 label-luxury text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-beige/60 last:border-0 hover:bg-beige/20 transition-colors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <div className="w-10 h-10 relative flex-shrink-0 bg-beige overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-beige flex-shrink-0 flex items-center justify-center">
                          <span className="text-brown/20 text-xs">IMG</span>
                        </div>
                      )}
                      <div>
                        <p className="font-sans text-sm text-brown font-medium">{product.name}</p>
                        {product.volume && (
                          <p className="font-sans text-xs text-brown/40">{product.volume}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-sans text-sm text-brown/60 hidden md:table-cell">
                    {product.category?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 font-sans text-sm text-brown font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <Badge variant={product.is_active ? 'success' : 'beige'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    {product.is_featured && <Badge variant="gold">Featured</Badge>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={ROUTES.adminProductEdit(product.id)}
                        className="text-brown/50 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="text-brown/50 hover:text-red-500 text-xs font-sans uppercase tracking-luxury transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm modal */}
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
