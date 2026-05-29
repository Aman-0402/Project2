'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { ROUTES } from '@/constants/config'
import CurrencyPrice from '@/components/ui/CurrencyPrice'
import type { ProductListItem } from '@/types'

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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function FeaturedPerfumes() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    productService.getFeatured()
      .then((res) => { if (res.success && res.data) setProducts(res.data.slice(0, 4)) })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="section-padding bg-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.025] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-beige/60 to-transparent pointer-events-none" />

      <div className="relative container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">Curated Selection</p>
          <h2 className="heading-luxury">Featured Fragrances</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#1C0F0A] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center font-sans text-brown/40 text-sm">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const moodTags = getMoodTags(product.category?.slug)
              return (
                <motion.div
                  key={product.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                >
                  <Link href={ROUTES.product(product.slug)} className="group block cursor-pointer transition-all duration-500 group-hover:drop-shadow-[0_20px_40px_rgba(198,161,110,0.25)]">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      {/* Layered composite or single image */}
                      {product.images?.length >= 2 && product.image_layer_effect ? (
                        <>
                          <Image
                            src={product.images[1]}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </>
                      ) : product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-108"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <LuxuryPlaceholder initial={product.name[0]} />
                      )}

                      {/* Always-visible bottom gradient with name + price */}
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#1C0F0A] via-[#1C0F0A]/60 to-transparent pointer-events-none" />

                      {/* Featured badge */}
                      {product.is_featured && (
                        <div className="absolute top-3 left-3 bg-gold/90 backdrop-blur-sm px-2.5 py-1">
                          <span className="font-sans text-[9px] uppercase tracking-luxury text-brown font-semibold">Featured</span>
                        </div>
                      )}

                      {/* Always-visible name + price */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="font-serif text-base text-ivory leading-tight mb-1">{product.name}</h3>
                        <CurrencyPrice price={product.price} className="font-sans text-xs text-gold/80" />
                      </div>

                      {/* Hover — gold border glow */}
                      <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-gold/50 transition-all duration-500 pointer-events-none" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href={ROUTES.collections} className="btn-luxury-outline">
            View Full Collection
            <span className="text-xs">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
