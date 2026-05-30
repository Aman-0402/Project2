'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '@/services/products'
import { settingsService } from '@/services/settings'
import WhatsAppCTALink from '@/components/whatsapp/WhatsAppCTALink'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Badge from '@/components/ui/Badge'
import { ROUTES } from '@/constants/config'
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
  const [activeSlot, setActiveSlot] = useState(0)
  const [direction, setDirection] = useState(0)
  const [bottleHovered, setBottleHovered] = useState(false)
  const [layerEffectEnabled, setLayerEffectEnabled] = useState(true)
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null)
  const currency = useCurrency()

  useEffect(() => {
    settingsService.getAll().then((res) => {
      if (res.success && res.data) {
        setLayerEffectEnabled(res.data.image_layer_effect !== 'false')
      }
    })
  }, [])

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
    <div className="bg-ivory">
      <div className="container-luxury pt-28 pb-16">
        <Link href={ROUTES.collections} className="inline-flex items-center gap-1.5 text-brown/40 hover:text-gold transition-colors text-xs font-sans uppercase tracking-luxury mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Collections
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-14 items-start">
          {/* Image Gallery */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {(() => {
              const images = product.images?.length ? product.images : product.image ? [product.image] : []
              const hasLayered = images.length >= 2 && layerEffectEnabled && product.image_layer_effect !== false

              // slots: 0 = layered composite, then images[2], images[3]
              const slots = [0, ...(images.length > 2 ? [2] : []), ...(images.length > 3 ? [3] : [])]
              const go = (next: number) => {
                setDirection(next > activeSlot ? 1 : -1)
                setActiveSlot(next)
              }
              const isLayered = slots[activeSlot] === 0 && hasLayered
              const singleSrc = images[slots[activeSlot]]

              return (
                <div className="flex flex-col">
                  {/* Main image — 3:4 portrait */}
                  <div className="relative aspect-[3/4] bg-beige overflow-hidden">
                    {images.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-px bg-gold/40" />
                        <span className="font-serif text-8xl text-brown/10">{product.name[0]}</span>
                        <div className="w-16 h-px bg-gold/40" />
                      </div>
                    ) : isLayered ? (
                      /* ── Layered composite: bg + bottle ── */
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="layered"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0"
                        >
                          {/* Background layer */}
                          <Image
                            src={images[1]}
                            alt="background"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 42vw"
                          />
                          {/* Bottle layer — PNG transparent, zoom on hover */}
                          <motion.div
                            className="absolute inset-0 cursor-zoom-in"
                            animate={{ scale: bottleHovered ? 1.09 : 1 }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            onMouseEnter={() => setBottleHovered(true)}
                            onMouseLeave={() => setBottleHovered(false)}
                          >
                            <Image
                              src={images[0]}
                              alt={product.name}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1024px) 100vw, 42vw"
                              priority
                            />
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      /* ── Single image slide ── */
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={activeSlot}
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
                            src={singleSrc}
                            alt={`${product.name} view ${activeSlot + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 42vw"
                          />
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* Prev / Next — only when extra slides exist */}
                    {slots.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => go((activeSlot - 1 + slots.length) % slots.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/80 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                          aria-label="Previous"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-brown">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => go((activeSlot + 1) % slots.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-ivory/80 hover:bg-ivory flex items-center justify-center transition-colors z-10"
                          aria-label="Next"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-brown">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails — slot 0 shows bottle thumb, then extra images */}
                  {slots.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {slots.map((imgIdx, s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => go(s)}
                          className={`relative w-16 aspect-square overflow-hidden flex-shrink-0 border-2 transition-colors duration-200 ${
                            s === activeSlot ? 'border-gold' : 'border-transparent hover:border-gold/40'
                          }`}
                          aria-label={s === 0 ? 'Composite view' : `View ${s + 1}`}
                        >
                          <Image src={images[imgIdx]} alt={`thumbnail ${s + 1}`} fill className="object-cover" sizes="64px" />
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
            className="flex flex-col justify-start"
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

            {/* Price — updates with selected volume */}
            {(() => {
              const volumes = product.volume
                ? product.volume.split(',').map(s => s.trim()).filter(Boolean)
                : []
              const hasVolumePrices = product.volume_prices && Object.keys(product.volume_prices).length > 0
              const activeVol = selectedVolume ?? (hasVolumePrices ? volumes[0] : null)
              const activePrice = (hasVolumePrices && activeVol && product.volume_prices[activeVol])
                ? product.volume_prices[activeVol]
                : Number(product.price)

              return (
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-sans text-3xl text-brown font-medium">
                      {formatPrice(activePrice, currency)}
                    </span>
                    {activeVol && (
                      <span className="font-sans text-sm text-brown/40">{activeVol}</span>
                    )}
                  </div>

                  {/* Volume selector */}
                  {volumes.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {volumes.map((vol) => {
                        const price = hasVolumePrices ? product.volume_prices[vol] : null
                        const isActive = (activeVol === vol)
                        return (
                          <button
                            key={vol}
                            type="button"
                            onClick={() => setSelectedVolume(vol)}
                            className={`px-4 py-2 text-xs font-sans border transition-all duration-200 ${
                              isActive
                                ? 'bg-brown text-ivory border-brown'
                                : 'bg-transparent text-brown/60 border-beige-dark hover:border-gold hover:text-gold'
                            }`}
                          >
                            {vol}
                            {price && (
                              <span className={`ml-1.5 text-[10px] ${isActive ? 'text-gold/70' : 'text-brown/35'}`}>
                                {formatPrice(price, currency)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}

            <div className="w-12 h-px bg-gold mb-6" />

            {/* Description */}
            {product.description && (
              <p className="font-sans text-sm text-brown/70 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* WhatsApp CTAs */}
            {(() => {
              const volumes = product.volume
                ? product.volume.split(',').map(s => s.trim()).filter(Boolean)
                : []
              const hasVolumePrices = product.volume_prices && Object.keys(product.volume_prices).length > 0
              const activeVol = selectedVolume ?? (volumes[0] ?? undefined)
              const activePrice = (hasVolumePrices && activeVol && product.volume_prices[activeVol])
                ? product.volume_prices[activeVol]
                : Number(product.price)
              return (
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <WhatsAppCTALink
                    productName={product.name}
                    price={formatPrice(activePrice, currency)}
                    volume={activeVol}
                    description={product.description ?? undefined}
                    fragranceNotes={product.fragrance_notes}
                    variant="buy"
                    className="flex-1 justify-center"
                  />
                  <WhatsAppCTALink
                    productName={product.name}
                    volume={activeVol}
                    description={product.description ?? undefined}
                    variant="inquiry"
                    className="flex-1 justify-center"
                  />
                </div>
              )
            })()}

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
