'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/products/ProductCard'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'
import type { ProductListItem, Category } from '@/types'

export default function CollectionsClient() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([productsRes, categoriesRes]) => {
        if (productsRes.success && productsRes.data) setProducts(productsRes.data)
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = activeCategory
    ? products.filter((p) => p.category?.slug === activeCategory)
    : products

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page header */}
      <div className="bg-brown py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <div className="container-luxury text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="label-luxury text-gold mb-4">Explore</p>
            <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide">Collections</h1>
            <div className="w-12 h-px bg-gold mx-auto mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="section-padding">
        <div className="container-luxury">
          {/* Category filters */}
          {categories.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-2 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 text-xs font-sans uppercase tracking-luxury border transition-all duration-300 ${
                  !activeCategory
                    ? 'bg-brown text-ivory border-brown'
                    : 'bg-transparent text-brown border-brown/30 hover:border-brown'
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category?.slug === cat.slug).length
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-5 py-2 text-xs font-sans uppercase tracking-luxury border transition-all duration-300 ${
                      activeCategory === cat.slug
                        ? 'bg-brown text-ivory border-brown'
                        : 'bg-transparent text-brown border-brown/30 hover:border-brown'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-beige animate-pulse">
                  <div className="aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-beige-dark rounded w-3/4" />
                    <div className="h-3 bg-beige-dark rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-brown/30 mb-4">No fragrances found</p>
              <button
                onClick={() => setActiveCategory(null)}
                className="label-luxury text-gold hover:text-gold-dark transition-colors"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
