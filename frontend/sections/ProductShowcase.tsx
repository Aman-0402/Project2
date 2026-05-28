'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'
import { formatPrice } from '@/utils/formatters'
import { ROUTES } from '@/constants/config'
import type { ProductListItem, Category } from '@/types'

const MOOD_TAGS: Record<string, string[]> = {
  oud:      ['Smoky', 'Warm', 'Bold'],
  floral:   ['Romantic', 'Fresh', 'Soft'],
  citrus:   ['Bright', 'Zesty', 'Clean'],
  oriental: ['Exotic', 'Spicy', 'Rich'],
  woody:    ['Earthy', 'Deep', 'Grounded'],
  fresh:    ['Airy', 'Crisp', 'Light'],
}

function getMoodTags(categorySlug?: string): string[] {
  if (!categorySlug) return []
  const key = categorySlug.toLowerCase()
  for (const [k, tags] of Object.entries(MOOD_TAGS)) {
    if (key.includes(k)) return tags
  }
  return []
}

function LuxuryPlaceholder({ initial }: { initial: string }) {
  return (
    <div className="absolute inset-0 bg-[#1C0F0A] flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 280" fill="none" className="w-full h-full opacity-40" aria-hidden="true">
        <circle cx="100" cy="140" r="70" stroke="#C6A16E" strokeWidth="0.6" />
        <circle cx="100" cy="140" r="50" stroke="#C6A16E" strokeWidth="0.4" />
        <circle cx="100" cy="140" r="30" stroke="#C6A16E" strokeWidth="0.3" />
        <line x1="100" y1="70" x2="100" y2="20"  stroke="#C6A16E" strokeWidth="0.5" />
        <line x1="170" y1="140" x2="190" y2="140" stroke="#C6A16E" strokeWidth="0.5" />
        <line x1="100" y1="210" x2="100" y2="260" stroke="#C6A16E" strokeWidth="0.5" />
        <line x1="30"  y1="140" x2="10"  y2="140" stroke="#C6A16E" strokeWidth="0.5" />
        <polygon points="100,100 120,130 100,160 80,130" stroke="#C6A16E" strokeWidth="0.5" fill="#C6A16E" fillOpacity="0.06" />
      </svg>
      <span className="absolute font-serif text-4xl text-gold/50 italic">{initial}</span>
    </div>
  )
}

export default function ProductShowcase() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([productsRes, categoriesRes]) => {
        if (productsRes.success && productsRes.data) setProducts(productsRes.data.slice(0, 8))
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = activeCategory
    ? products.filter((p) => p.category?.slug === activeCategory)
    : products

  return (
    <section className="section-padding bg-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] pointer-events-none" />

      <div className="relative container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">The Collection</p>
          <h2 className="heading-luxury">All Fragrances</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        {/* Category filter */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 text-xs font-sans uppercase tracking-luxury border transition-all duration-300 cursor-pointer ${
                !activeCategory
                  ? 'bg-brown text-ivory border-brown'
                  : 'bg-transparent text-brown border-brown/30 hover:border-brown'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-2 text-xs font-sans uppercase tracking-luxury border transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'bg-brown text-ivory border-brown'
                    : 'bg-transparent text-brown border-brown/30 hover:border-brown'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#1C0F0A] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center font-sans text-brown/40 text-sm py-12">No products in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => {
                const moodTags = getMoodTags(product.category?.slug)
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                  >
                    <Link href={ROUTES.product(product.slug)} className="group block cursor-pointer">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <LuxuryPlaceholder initial={product.name[0]} />
                        )}

                        {/* Always-visible bottom gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#1C0F0A] via-[#1C0F0A]/60 to-transparent pointer-events-none" />

                        {/* Featured badge */}
                        {product.is_featured && (
                          <div className="absolute top-3 left-3 bg-gold/90 backdrop-blur-sm px-2.5 py-1">
                            <span className="font-sans text-[9px] uppercase tracking-luxury text-brown font-semibold">Featured</span>
                          </div>
                        )}

                        {/* Always-visible name + price at bottom */}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h3 className="font-serif text-base text-ivory leading-tight mb-1">{product.name}</h3>
                          <p className="font-sans text-xs text-gold/80">{formatPrice(product.price)}</p>
                        </div>

                        {/* Hover overlay — mood tags + explore CTA */}
                        <div className="absolute inset-0 bg-[#1C0F0A]/72 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {moodTags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1.5 px-4">
                              {moodTags.map((tag) => (
                                <span key={tag} className="font-sans text-[10px] uppercase tracking-luxury text-ivory/70 border border-gold/30 px-2 py-0.5">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-luxury text-gold border-b border-gold/40 pb-px mt-1">
                            Explore <span>&rarr;</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href={ROUTES.collections}
            className="inline-flex items-center gap-3 bg-transparent text-brown border border-brown/40 px-10 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory hover:border-brown transition-all duration-300"
          >
            View All Fragrances
            <span>&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
