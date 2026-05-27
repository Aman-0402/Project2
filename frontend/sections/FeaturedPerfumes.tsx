'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import { formatPrice } from '@/utils/formatters'
import { ROUTES } from '@/constants/config'
import type { ProductListItem } from '@/types'

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
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">Curated Selection</p>
          <h2 className="heading-luxury">Featured Fragrances</h2>
          <div className="gold-divider mx-auto mt-6" />
        </motion.div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-beige animate-pulse">
                <div className="aspect-[3/4]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-beige-dark rounded w-3/4" />
                  <div className="h-3 bg-beige-dark rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center font-sans text-brown/40 text-sm">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Link href={ROUTES.product(product.slug)} className="group block">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-beige overflow-hidden mb-4">
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
                        <div className="text-center">
                          <div className="w-12 h-px bg-gold mx-auto mb-3" />
                          <p className="font-serif text-brown/30 text-xl">{product.name[0]}</p>
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-brown/0 group-hover:bg-brown/20 transition-colors duration-500" />
                  </div>

                  {/* Info */}
                  <div>
                    {product.category && (
                      <p className="label-luxury text-[9px] mb-1 text-gold/80">{product.category.name}</p>
                    )}
                    <h3 className="font-serif text-lg text-brown leading-tight group-hover:text-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-sans text-sm text-brown/60">{formatPrice(product.price)}</p>
                      {product.volume && (
                        <p className="font-sans text-xs text-brown/40">{product.volume}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href={ROUTES.collections}
            className="inline-flex items-center gap-3 text-brown border-b border-brown/30 pb-1 font-sans text-sm uppercase tracking-luxury hover:text-gold hover:border-gold transition-all duration-300"
          >
            View Full Collection
            <span className="text-xs">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
