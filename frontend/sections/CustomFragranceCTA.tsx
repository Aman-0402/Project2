'use client'

import { motion } from 'framer-motion'
import { buildCustomFragranceUrl } from '@/utils/whatsapp'
import { CONFIG } from '@/constants/config'

export default function CustomFragranceCTA() {
  return (
    <section className="section-padding bg-beige relative overflow-hidden">
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
              <a
                href={buildCustomFragranceUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brown text-ivory px-10 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-brown-dark transition-colors duration-300"
              >
                Begin Your Journey
              </a>
            </div>

            <p className="font-sans text-xs text-brown/30 mt-6 tracking-luxury uppercase">
              Via WhatsApp Consultation
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
