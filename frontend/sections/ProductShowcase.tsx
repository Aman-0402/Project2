'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'
import { formatPrice } from '@/utils/formatters'
import { ROUTES } from '@/constants/config'
import type { ProductListItem, Category } from '@/types'

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
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">The Collection</p>
          <h2 className="heading-luxury">All Fragrances</h2>
          <div className="gold-divider mx-auto mt-6" />
        </motion.div>

        {/* Category filter */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
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
          <p className="text-center font-sans text-brown/40 text-sm py-12">No products in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <Link href={ROUTES.product(product.slug)} className="group block">
                  <div className="relative aspect-[3/4] bg-beige overflow-hidden mb-3">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-3xl text-brown/20">{product.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-brown/0 group-hover:bg-brown/15 transition-colors duration-500" />
                  </div>
                  <p className="font-serif text-base text-brown group-hover:text-gold transition-colors duration-300">
                    {product.name}
                  </p>
                  <p className="font-sans text-xs text-brown/50 mt-1">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            ))}
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
            className="inline-flex items-center gap-2 bg-transparent text-brown border border-brown px-8 py-3 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory transition-all duration-300"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
