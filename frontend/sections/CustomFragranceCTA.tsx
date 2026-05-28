'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { buildCustomFragranceUrl } from '@/utils/whatsapp'
import { ROUTES } from '@/constants/config'

export default function CustomFragranceCTA() {
  return (
    <section className="section-padding bg-beige relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
      {/* Radial light center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,_rgba(198,161,110,0.08)_0%,_transparent_70%)] pointer-events-none" />
      {/* Decorative ingredient hint — top right */}
      <div className="absolute top-8 right-8 w-32 h-32 opacity-[0.06] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="32" stroke="#C6A16E" strokeWidth="0.8" />
          <circle cx="40" cy="40" r="20" stroke="#C6A16E" strokeWidth="0.8" />
          <circle cx="40" cy="40" r="6" fill="#C6A16E" />
          <line x1="40" y1="8" x2="40" y2="0" stroke="#C6A16E" strokeWidth="0.8" />
          <line x1="72" y1="40" x2="80" y2="40" stroke="#C6A16E" strokeWidth="0.8" />
          <line x1="40" y1="72" x2="40" y2="80" stroke="#C6A16E" strokeWidth="0.8" />
          <line x1="8" y1="40" x2="0" y2="40" stroke="#C6A16E" strokeWidth="0.8" />
        </svg>
      </div>
      {/* Decorative diamond — bottom left */}
      <div className="absolute bottom-8 left-8 opacity-[0.05] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 60 60" width="80" height="80" fill="none">
          <polygon points="30,2 58,30 30,58 2,30" stroke="#C6A16E" strokeWidth="0.8" />
          <polygon points="30,12 48,30 30,48 12,30" stroke="#C6A16E" strokeWidth="0.8" />
          <polygon points="30,22 38,30 30,38 22,30" fill="#C6A16E" fillOpacity="0.5" stroke="#C6A16E" strokeWidth="0.5" />
        </svg>
      </div>
      {/* Gold line accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container-luxury">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="label-luxury mb-4">Bespoke Service</p>
            <h2 className="heading-luxury text-brown mb-6">
              Your Signature<br />
              <em className="not-italic text-gradient-gold">Fragrance</em>
            </h2>
            <div className="gold-divider mx-auto" />
            <p className="font-sans text-brown/60 text-sm leading-relaxed mt-6 mb-10 max-w-md mx-auto">
              Work directly with our master perfumer to craft a completely unique fragrance
              that belongs only to you. Your story, your scent.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={ROUTES.createFragrance} className="btn-luxury">
                Design Your Fragrance
              </Link>
              <a
                href={buildCustomFragranceUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-outline"
              >
                WhatsApp Us
              </a>
            </div>

            <p className="font-sans text-xs text-brown/30 mt-6 tracking-luxury uppercase">
              5-step interactive experience · Direct consultation
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
