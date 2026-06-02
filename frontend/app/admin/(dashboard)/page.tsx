'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'
import { inquiryService } from '@/services/inquiries'
import { useAuth } from '@/context/AuthContext'
import { ROUTES } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types'

interface Stats {
  total: number
  active: number
  featured: number
  categories: number
  newInquiries: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
}

function StatCard({
  label,
  value,
  icon,
  accent,
  isLoading,
  index,
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
  isLoading: boolean
  index: number
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="bg-ivory border border-beige-dark p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow duration-300"
    >
      <div>
        {isLoading ? (
          <div className="w-10 h-8 bg-beige animate-pulse rounded mb-2" />
        ) : (
          <p className="font-serif text-3xl text-brown mb-1">{value}</p>
        )}
        <p className="font-sans text-[10px] text-brown/50 uppercase tracking-luxury">{label}</p>
      </div>
      <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
    </motion.div>
  )
}

const STAT_ICONS = {
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.399 2.798H4.198c-1.429 0-2.4-1.798-1.4-2.798L4 14.5" />
    </svg>
  ),
  active: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  featured: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  inquiries: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, featured: 0, categories: 0, newInquiries: 0 })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  function fetchData(silent = false) {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)
    Promise.all([
      productService.adminGetAll(),
      categoryService.getAll(),
      inquiryService.adminGetAll(),
    ]).then(([productsRes, categoriesRes, inquiriesRes]) => {
      const products = productsRes.data ?? []
      const inquiries = inquiriesRes.data ?? []
      setStats({
        total: products.length,
        active: products.filter((p) => p.is_active).length,
        featured: products.filter((p) => p.is_featured).length,
        categories: categoriesRes.data?.length ?? 0,
        newInquiries: inquiries.filter((i) => i.status === 'new').length,
      })
      setRecentProducts(products.slice(0, 5))
    }).finally(() => { setIsLoading(false); setIsRefreshing(false) })
  }

  useEffect(() => { fetchData() }, [])

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: STAT_ICONS.products, accent: 'bg-gold/10 text-gold' },
    { label: 'Active Listings', value: stats.active, icon: STAT_ICONS.active, accent: 'bg-green-50 text-green-600' },
    { label: 'Featured', value: stats.featured, icon: STAT_ICONS.featured, accent: 'bg-gold/15 text-gold-dark' },
    { label: 'Categories', value: stats.categories, icon: STAT_ICONS.categories, accent: 'bg-beige text-brown/60' },
    { label: 'New Inquiries', value: stats.newInquiries, icon: STAT_ICONS.inquiries, accent: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="max-w-5xl">
      {/* Welcome */}
      <motion.div
        className="mb-8 flex items-end justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="label-luxury mb-1">Welcome back</p>
          <h1 className="font-serif text-3xl text-brown">{user?.username ?? 'Admin'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-sans text-xs text-brown/35 uppercase tracking-luxury hidden sm:block">{today}</p>
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            title="Refresh dashboard data"
            className="inline-flex items-center gap-1.5 text-brown/40 hover:text-gold border border-brown/20 hover:border-gold/40 px-3 py-1.5 text-[10px] font-sans uppercase tracking-luxury transition-all duration-300 disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {statCards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            accent={card.accent}
            isLoading={isLoading}
            index={i}
          />
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="label-luxury mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={ROUTES.adminProductNew}
            className="inline-flex items-center gap-2 bg-gold text-ivory px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Link>
          <Link
            href={ROUTES.adminProducts}
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown/40 px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory hover:border-brown transition-all duration-300"
          >
            Manage Products
          </Link>
          <Link
            href={ROUTES.adminInquiries}
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown/40 px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory hover:border-brown transition-all duration-300"
          >
            View Inquiries
            {stats.newInquiries > 0 && (
              <span className="bg-gold text-ivory text-[9px] font-sans px-1.5 py-0.5 min-w-[18px] text-center">
                {stats.newInquiries}
              </span>
            )}
          </Link>
          <Link
            href={ROUTES.adminSettings}
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown/40 px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory hover:border-brown transition-all duration-300"
          >
            Settings
          </Link>
        </div>
      </motion.div>

      {/* Recent products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="label-luxury">Recent Products</p>
          <Link
            href={ROUTES.adminProducts}
            className="text-brown/40 hover:text-gold text-[10px] font-sans uppercase tracking-luxury transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="bg-ivory border border-beige-dark overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-sans text-sm text-brown/50 mb-2">No products yet.</p>
              <Link href={ROUTES.adminProductNew} className="text-gold text-xs font-sans hover:text-gold-dark">
                Add your first product &rarr;
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige-dark bg-beige/30">
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Product</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px] hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px]">Price</th>
                  <th className="text-left px-5 py-3 label-luxury text-[10px] hidden md:table-cell">Status</th>
                  <th className="text-right px-5 py-3 label-luxury text-[10px]">Edit</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className="border-b border-beige/50 last:border-0 hover:bg-beige/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-sm text-brown font-medium leading-none">{product.name}</p>
                      {product.volume && (
                        <p className="font-sans text-xs text-brown/35 mt-1">{product.volume}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-sans text-sm text-brown/50 hidden sm:table-cell">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 font-sans text-sm text-brown font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-[10px] font-sans uppercase tracking-luxury px-2 py-0.5 ${
                        product.is_active
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-beige text-brown/40 border border-beige-dark'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={ROUTES.adminProductEdit(product.id)}
                        className="text-brown/40 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  )
}
