'use client'

import { motion } from 'framer-motion'
import { buildWhatsAppUrl, buildCustomFragranceUrl } from '@/utils/whatsapp'
import { CONFIG } from '@/constants/config'

export default function WhatsAppCTASection() {
  return (
    <section className="relative py-28 bg-depth overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(176,141,87,0.1)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/30" />

      <div className="relative container-luxury text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="label-luxury text-gold mb-4">Connect With Us</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory tracking-wide leading-tight mb-6">
            Experience Luxury<br />
            <em className="not-italic text-gradient-gold">Personally</em>
          </h2>
          <div className="w-12 h-px bg-gold mx-auto my-8" />
          <p className="font-sans text-ivory/50 text-sm leading-relaxed max-w-md mx-auto mb-10">
            Our fragrance consultants are available on WhatsApp for product inquiries,
            custom fragrance commissions, and exclusive consultations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={buildWhatsAppUrl(`Hello, I would like to learn more about ${CONFIG.brandName} fragrances.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-[#1ebe5a] transition-colors duration-300"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href={buildCustomFragranceUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-transparent text-ivory border border-gold/40 px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:border-gold hover:text-gold transition-all duration-300"
            >
              Custom Fragrance
            </a>
          </div>

          <p className="font-sans text-xs text-ivory/20 mt-8 tracking-luxury uppercase">
            Typically replies within a few hours
          </p>
        </motion.div>
      </div>
    </section>
  )
}
