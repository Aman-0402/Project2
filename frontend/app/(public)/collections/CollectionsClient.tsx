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
      {/* Page hero */}
      <div className="collections-hero relative overflow-hidden flex items-center justify-center">
        {/* Dot texture */}
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.04]" />

        {/* Amber radial glow — centre */}
        <div className="collections-hero-glow-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" />

        {/* Left ambient */}
        <div className="collections-hero-glow-side absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none" />
        <div className="collections-hero-glow-side absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none" />

        {/* Floating particles */}
        {[
          { x: '15%',  y: '25%', d: 3.2, op: 0.18 },
          { x: '82%',  y: '18%', d: 4.8, op: 0.14 },
          { x: '68%',  y: '72%', d: 2.4, op: 0.22 },
          { x: '28%',  y: '65%', d: 3.6, op: 0.16 },
          { x: '50%',  y: '12%', d: 2.0, op: 0.12 },
          { x: '9%',   y: '55%', d: 4.0, op: 0.10 },
          { x: '90%',  y: '48%', d: 3.0, op: 0.15 },
          { x: '40%',  y: '80%', d: 2.2, op: 0.13 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.x, top: p.y,
              width: `${p.d}px`, height: `${p.d}px`,
              background: `rgba(198,161,110,${p.op})`,
            }}
            animate={{ y: [0, -18, 0], opacity: [p.op, p.op * 2, p.op] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}

        {/* Smoke SVG */}
        <svg
          className="collections-hero-smoke absolute bottom-0 inset-x-0 w-full pointer-events-none opacity-[0.06]"
          viewBox="0 0 1440 200" preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,160 C200,80 400,180 600,120 C800,60 1000,160 1200,100 C1300,70 1380,130 1440,100 L1440,200 L0,200Z" fill="rgba(198,161,110,1)" />
          <path d="M0,180 C300,120 500,170 720,140 C940,110 1100,170 1440,150 L1440,200 L0,200Z" fill="rgba(255,255,255,0.5)" />
        </svg>

        {/* Top fade line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ivory to-transparent" />

        {/* Content */}
        <div className="container-luxury text-center relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.p
              className="label-luxury text-gold mb-4"
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ duration: 1.2, delay: 0.1 }}
            >
              Explore
            </motion.p>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-ivory tracking-wide leading-none mb-6">
              Collections
            </h1>
            <motion.div
              className="collections-hero-divider w-16 h-px mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.p
              className="font-sans text-sm text-ivory/35 mt-5 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {products.length > 0 ? `${products.length} Fragrances` : 'Our Fragrances'}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Filter strip — warm ivory layer */}
      {categories.length > 0 && (
        <div className="bg-[#F5EDE2] border-b border-[rgba(200,169,107,0.15)] py-6">
          <div className="container-luxury">
            <motion.div
              className="flex flex-wrap items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* All chip */}
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`collections-chip ${!activeCategory ? 'collections-chip-active' : 'collections-chip-inactive'}`}
              >
                All
                <span className={`ml-1.5 text-[10px] ${!activeCategory ? 'text-gold/70' : 'text-brown/35'}`}>
                  {products.length}
                </span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category?.slug === cat.slug).length
                const isActive = activeCategory === cat.slug
                return (
                  <button
                    type="button"
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`collections-chip ${isActive ? 'collections-chip-active' : 'collections-chip-inactive'}`}
                  >
                    {cat.name}
                    <span className={`ml-1.5 text-[10px] ${isActive ? 'text-gold/70' : 'text-brown/35'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          </div>
        </div>
      )}

      {/* Product grid — slightly deeper ivory layer */}
      <div className="bg-[#EDE4D9] py-16 md:py-20 px-4 md:px-8 lg:px-16">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-beige/60 animate-pulse rounded-xl">
                  <div className="aspect-[3/4]" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-brown/30 mb-4">No fragrances found</p>
              <button
                type="button"
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
