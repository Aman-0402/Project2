'use client'

import { motion } from 'framer-motion'
import { CONFIG } from '@/constants/config'
import { buildWhatsAppUrl, buildWhatsAppUrl2 } from '@/utils/whatsapp'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const BOTTLE_ICON = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8" aria-hidden="true">
    <rect x="13" y="2" width="6" height="4" rx="2" />
    <path strokeLinecap="round" d="M13 6h6M11 10h10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 10 Q8 13 8 16v10a2 2 0 002 2h12a2 2 0 002-2V16q0-3-3-6" />
    <path strokeLinecap="round" d="M8 20h16" strokeOpacity="0.4" />
  </svg>
)

const CONSULT_ICON = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H10l-6 4V8z" />
    <path strokeLinecap="round" d="M10 13h12M10 18h8" strokeOpacity="0.5" />
  </svg>
)

const EMAIL_ICON = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8" aria-hidden="true">
    <rect x="3" y="7" width="26" height="18" rx="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l13 9 13-9" />
  </svg>
)

export default function ContactCards() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury max-w-4xl">

        {/* Section header */}
        <motion.div className="text-center mb-16"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7 }}>
          <p className="label-luxury mb-3">Direct Contact</p>
          <h2 className="heading-luxury">Speak With Our Team</h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="font-sans text-brown/55 text-sm mt-6 leading-relaxed max-w-md mx-auto">
            Two specialists. One dedicated to orders, one to the art of finding your perfect scent.
          </p>
        </motion.div>

        {/* Person cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* M. Roeesh — primary */}
          <motion.div
            className="contact-card group relative overflow-hidden"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ y: -6 }}>
            {/* Hover glow */}
            <div className="contact-card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />

            <div className="relative p-8">
              {/* Icon */}
              <div className="text-gold/50 group-hover:text-gold/80 transition-colors duration-400 mb-5">
                {BOTTLE_ICON}
              </div>

              <p className="label-luxury text-gold mb-1">Buy &amp; Orders</p>
              <h3 className="font-serif text-3xl text-brown mb-1 leading-tight">M. Roeesh</h3>
              <p className="font-sans text-sm text-brown/45 tracking-wide mb-2">+91 97245 86101</p>
              <div className="w-8 h-px bg-gold/35 mb-5" />
              <p className="font-sans text-sm text-brown/55 leading-relaxed mb-7">
                For product orders, pricing enquiries, and same-day purchases at the store.
              </p>

              <a href={buildWhatsAppUrl('Hello, I would like to inquire about your fragrances.')}
                target="_blank" rel="noopener noreferrer"
                className="btn-cta-gold inline-flex items-center gap-2.5 px-8 py-3 font-sans text-xs uppercase tracking-luxury font-semibold transition-all duration-300 hover:-translate-y-0.5">
                {WA_ICON}
                WhatsApp
              </a>
            </div>
          </motion.div>

          {/* M. Munavvar — secondary */}
          <motion.div
            className="contact-card group relative overflow-hidden"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp} transition={{ duration: 0.7, delay: 0.22 }}
            whileHover={{ y: -6 }}>
            <div className="contact-card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />

            <div className="relative p-8">
              <div className="text-gold/50 group-hover:text-gold/80 transition-colors duration-400 mb-5">
                {CONSULT_ICON}
              </div>

              <p className="label-luxury text-gold mb-1">Details &amp; Consultations</p>
              <h3 className="font-serif text-3xl text-brown mb-1 leading-tight">M. Munavvar</h3>
              <p className="font-sans text-sm text-brown/45 tracking-wide mb-2">+91 90163 61538</p>
              <div className="w-8 h-px bg-gold/35 mb-5" />
              <p className="font-sans text-sm text-brown/55 leading-relaxed mb-7">
                For fragrance consultations, bespoke requests, and personalised scent recommendations.
              </p>

              <a href={buildWhatsAppUrl2('Hello, I would like to learn more about your fragrances.')}
                target="_blank" rel="noopener noreferrer"
                className="btn-cta-glass group/btn inline-flex items-center gap-2.5 px-8 py-3 font-sans text-xs uppercase tracking-luxury overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
                <span className="btn-cta-glass-fill absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-[380ms] ease-out" />
                <span className="relative z-10 flex items-center gap-2.5 transition-colors duration-200 group-hover/btn:text-[#1a0e02]">
                  {WA_ICON}
                  WhatsApp
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Email */}
        <motion.div
          className="contact-card text-center p-10"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="text-gold/50 flex justify-center mb-5">{EMAIL_ICON}</div>
          <p className="label-luxury mb-3">Email</p>
          <a href={`mailto:${CONFIG.email}`}
            className="font-serif text-2xl md:text-3xl text-brown hover:text-gold transition-colors duration-400 leading-snug">
            {CONFIG.email}
          </a>
          <p className="font-sans text-xs text-brown/40 mt-3 uppercase tracking-luxury">We respond within 24 hours</p>
        </motion.div>

      </div>
    </section>
  )
}
