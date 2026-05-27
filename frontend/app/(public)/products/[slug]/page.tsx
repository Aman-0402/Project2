'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import WhatsAppCTALink from '@/components/whatsapp/WhatsAppCTALink'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Badge from '@/components/ui/Badge'
import { ROUTES, CONFIG } from '@/constants/config'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types'

const NOTE_LABELS: Record<string, string> = {
  top: 'Top Notes',
  middle: 'Heart Notes',
  base: 'Base Notes',
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative aspect-[4/5] bg-beige overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-px bg-gold/40" />
                  <span className="font-serif text-8xl text-brown/10">{product.name[0]}</span>
                  <div className="w-16 h-px bg-gold/40" />
                </div>
              )}
            </div>
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
              <span className="font-sans text-2xl text-brown font-medium">{formatPrice(product.price)}</span>
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
                price={formatPrice(product.price)}
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
