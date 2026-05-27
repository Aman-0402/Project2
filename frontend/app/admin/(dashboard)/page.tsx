'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types'

interface Stats {
  total: number
  active: number
  featured: number
  categories: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, featured: 0, categories: 0 })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([productService.adminGetAll(), categoryService.getAll()])
      .then(([productsRes, categoriesRes]) => {
        const products = productsRes.data ?? []
        setStats({
          total: products.length,
          active: products.filter((p) => p.is_active).length,
          featured: products.filter((p) => p.is_featured).length,
          categories: categoriesRes.data?.length ?? 0,
        })
        setRecentProducts(products.slice(0, 5))
      })
      .finally(() => setIsLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.total, color: 'border-gold/40' },
    { label: 'Active Products', value: stats.active, color: 'border-green-300' },
    { label: 'Featured', value: stats.featured, color: 'border-gold' },
    { label: 'Categories', value: stats.categories, color: 'border-brown/30' },
  ]

  return (
    <div className="max-w-5xl">
      {/* Welcome */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="label-luxury mb-1">Welcome back</p>
        <h1 className="font-serif text-3xl text-brown">{user?.username ?? 'Admin'}</h1>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className={`bg-ivory border-t-2 ${card.color} p-5 shadow-sm`}
          >
            {isLoading ? (
              <div className="w-12 h-7 bg-beige animate-pulse rounded" />
            ) : (
              <p className="font-serif text-3xl text-brown">{card.value}</p>
            )}
            <p className="label-luxury mt-2 text-[10px]">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <p className="label-luxury mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={ROUTES.adminProductNew}
            className="inline-flex items-center gap-2 bg-gold text-ivory px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
          >
            + Add Product
          </Link>
          <Link
            href={ROUTES.adminProducts}
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory transition-all duration-300"
          >
            Manage Products
          </Link>
          <Link
            href={ROUTES.adminCategories}
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory transition-all duration-300"
          >
            Categories
          </Link>
        </div>
      </motion.div>

      {/* Recent products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <p className="label-luxury mb-4">Recent Products</p>
        <div className="bg-ivory border border-beige-dark overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-sans text-sm text-brown/50">No products yet.</p>
              <Link href={ROUTES.adminProductNew} className="text-gold text-xs font-sans mt-2 inline-block hover:text-gold-dark">
                Add your first product &rarr;
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige-dark">
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Product</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Price</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-beige/60 last:border-0 hover:bg-beige/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-sans text-sm text-brown">{product.name}</p>
                      {product.category && (
                        <p className="font-sans text-xs text-brown/40 mt-0.5">{product.category.name}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-brown">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-sans uppercase tracking-luxury px-2 py-0.5 border ${product.is_active ? 'text-green-700 border-green-200 bg-green-50' : 'text-brown/40 border-beige-dark bg-beige'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}
