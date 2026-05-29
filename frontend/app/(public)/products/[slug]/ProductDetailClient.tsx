'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '@/services/products'
import WhatsAppCTALink from '@/components/whatsapp/WhatsAppCTALink'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Badge from '@/components/ui/Badge'
import { ROUTES, CONFIG } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import { useCurrency } from '@/hooks/useCurrency'
import type { Product } from '@/types'

const NOTE_LABELS: Record<string, string> = {
  top: 'Top Notes',
  middle: 'Heart Notes',
  base: 'Base Notes',
}

export default function ProductDetailClient() {
  const params = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const currency = useCurrency()

  useEffect(() => {
    if (!params.slug) return
    productService.getBySlug(params.slug)
      .then((res) => {
        if (res.success && res.data) setProduct(res.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false))
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl text-brown/30">Fragrance not found</p>
        <Link href={ROUTES.collections} className="label-luxury text-gold hover:text-gold-dark transition-colors">
          &larr; Back to Collections
        </Link>
      </div>
    )
  }

  const hasFragranceNotes =
    (product.fragrance_notes?.top?.length ?? 0) > 0 ||
    (product.fragrance_notes?.middle?.length ?? 0) > 0 ||
    (product.fragrance_notes?.base?.length ?? 0) > 0

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="container-luxury pt-32 pb-6">
        <nav className="flex items-center gap-2 text-xs font-sans">
          <Link href={ROUTES.home} className="text-brown/40 hover:text-gold transition-colors">{CONFIG.brandName}</Link>
          <span className="text-brown/20">/</span>
          <Link href={ROUTES.collections} className="text-brown/40 hover:text-gold transition-colors">Collections</Link>
          <span className="text-brown/20">/</span>
          <span className="text-brown">{product.name}</span>
        </nav>
      </div>

      {/* Product layout */}
      <div className="container-luxury pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {(() => {
              const images = product.images?.length ? product.images : product.image ? [product.image] : []
              const go = (next: number) => {
                setDirection(next > activeIndex ? 1 : -1)
                setActiveIndex(next)
              }
              return (
                <div>
                  {/* Main image */}
                  <div className="relative aspect-[4/5] bg-beige overflow-hidden">
                    {images.length > 0 ? (
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={activeIndex}
                          custom={direction}
                          variants={{
                            enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                            center: { x: 0, opacity: 1 },
                            exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                          }}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={images[activeIndex]}
                            alt={`${product.name} ${activeIndex + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={activeIndex === 0}
                          />
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-px bg-gold/40" />
                        <span className="font-serif text-8xl text-brown/10">{product.name[0]}</span>
                        <div className="w-16 h-px bg-gold/40" />
                      </div>
                    )}

                    {/* Prev / Next arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => go((activeIndex - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/80 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                          aria-label="Previous image"
                          type="button"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-brown">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => go((activeIndex + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/80 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                          aria-label="Next image"
                          type="button"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-brown">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                        {/* Counter */}
                        <div className="absolute bottom-3 right-3 bg-brown/60 text-ivory text-[10px] font-sans px-2 py-0.5">
                          {activeIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => go(i)}
                          className={`relative w-16 aspect-square overflow-hidden flex-shrink-0 border-2 transition-colors duration-200 ${
                            i === activeIndex ? 'border-gold' : 'border-transparent hover:border-gold/40'
                          }`}
                          aria-label={`View image ${i + 1}`}
                          type="button"
                        >
                          <Image src={src} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </motion.div>

          {/* Info */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Category + Featured */}
            <div className="flex items-center gap-3 mb-4">
              {product.category && (
                <p className="label-luxury text-gold">{product.category.name}</p>
              )}
              {product.is_featured && (
                <Badge variant="gold">Featured</Badge>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-4xl md:text-5xl text-brown leading-tight mb-2">
              {product.name}
            </h1>

            {/* Price + volume */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans text-2xl text-brown font-medium">{formatPrice(product.price, currency)}</span>
              {product.volume && (
                <span className="font-sans text-sm text-brown/40">{product.volume}</span>
              )}
            </div>

            <div className="w-12 h-px bg-gold mb-6" />

            {/* Description */}
            {product.description && (
              <p className="font-sans text-sm text-brown/70 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* WhatsApp CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <WhatsAppCTALink
                productName={product.name}
                price={formatPrice(product.price, currency)}
                variant="buy"
                className="flex-1 justify-center"
              />
              <WhatsAppCTALink
                productName={product.name}
                variant="inquiry"
                className="flex-1 justify-center"
              />
            </div>

            {/* Fragrance Notes */}
            {hasFragranceNotes && (
              <div className="border-t border-beige-dark pt-8">
                <p className="label-luxury mb-5">Fragrance Pyramid</p>
                <div className="space-y-4">
                  {(['top', 'middle', 'base'] as const).map((layer) => {
                    const notes = product.fragrance_notes?.[layer]
                    if (!notes || notes.length === 0) return null
                    return (
                      <div key={layer} className="flex gap-4">
                        <div className="w-20 flex-shrink-0">
                          <p className="font-sans text-xs text-brown/40 uppercase tracking-luxury">{NOTE_LABELS[layer]}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {notes.map((note) => (
                            <span key={note} className="font-sans text-xs text-brown bg-beige px-3 py-1 border border-beige-dark">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
