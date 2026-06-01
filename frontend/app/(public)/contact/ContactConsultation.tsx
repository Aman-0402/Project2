'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ROUTES } from '@/constants/config'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 4c-2 0-4 2-4 6s2 6 4 6 4-2 4-6-2-6-4-6z" />
        <path strokeLinecap="round" d="M16 16v12M10 28h12" strokeOpacity="0.45" />
        <circle cx="16" cy="10" r="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    title: 'Daily Signature Fragrance',
    desc: 'Find the scent that becomes you — worn every day, remembered always.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
        <circle cx="10" cy="14" r="5" />
        <circle cx="22" cy="14" r="5" />
        <path strokeLinecap="round" d="M10 9 Q16 4 22 9" />
        <path strokeLinecap="round" d="M6 24c0-3 2-5 4-5h12c2 0 4 2 4 5" strokeOpacity="0.45" />
      </svg>
    ),
    title: 'Wedding & Occasion Scents',
    desc: 'Bespoke fragrances for your most important moments. A scent for forever.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
        <rect x="6" y="14" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M12 14V10a4 4 0 018 0v4" />
        <path strokeLinecap="round" d="M16 20v4" strokeOpacity="0.45" />
        <circle cx="16" cy="19" r="1.5" fill="currentColor" fillOpacity="0.5" />
      </svg>
    ),
    title: 'Luxury Gift Consultation',
    desc: 'We help you choose the perfect gift — curated for the person you love.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 28 Q8 18 12 14 Q14 12 16 12 Q18 12 20 14 Q24 18 24 28" />
        <path strokeLinecap="round" d="M10 22h12" strokeOpacity="0.4" />
        <path strokeLinecap="round" d="M16 12V6" />
        <path strokeLinecap="round" d="M12 8l4-4 4 4" strokeOpacity="0.5" />
      </svg>
    ),
    title: 'Personal Oud Selection',
    desc: 'From raw agarwood to aged resin — discover the world of pure oud with our specialists.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 26V14l4-8h4l4 8v12" />
        <path strokeLinecap="round" d="M7 26h18" strokeOpacity="0.4" />
        <circle cx="16" cy="18" r="2" fill="currentColor" fillOpacity="0.35" />
        <path strokeLinecap="round" d="M13 12h6" strokeOpacity="0.45" />
      </svg>
    ),
    title: 'Custom Blend Experience',
    desc: 'Your story, your memory, your identity — distilled into a fragrance made only for you.',
  },
]

export default function ContactConsultation() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0C0700]">

      {/* Background depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,_rgba(198,161,110,0.10)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,_rgba(160,80,20,0.10)_0%,_transparent_60%)] pointer-events-none" />
      <div className="cta-grain absolute inset-0 opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/15 to-transparent" />

      <div className="container-luxury relative z-10">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7 }}>
          <p className="label-luxury text-[#C8A36A] mb-3">Private Experience</p>
          <h2 className="consult-heading font-serif font-light italic text-ivory leading-tight mb-4">
            Bespoke Fragrance
          </h2>
          <h2 className="consult-heading font-display font-bold text-gradient-gold leading-tight mb-8">
            Consultation
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C8A36A]/55" />
            <span className="text-[#C8A36A]/45 text-[10px]">◆</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C8A36A]/55" />
          </div>
          <p className="font-sans text-ivory/45 text-sm leading-[1.9] max-w-lg mx-auto">
            Every fragrance tells a story. Our specialists help you discover scents shaped around
            your personality, your memories, your moments, and your identity.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title}
              className="consult-card group relative border border-[#C8A36A]/15 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A36A]/35"
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.6, delay: i * 0.09 }}>
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#C8A36A]/25 group-hover:border-[#C8A36A]/55 transition-colors duration-400" />
              <div className="text-[#C8A36A]/45 group-hover:text-[#C8A36A]/80 transition-colors duration-400 mb-5">
                {s.icon}
              </div>
              <h3 className="font-serif text-ivory/85 text-lg mb-3 leading-snug group-hover:text-ivory transition-colors duration-300">
                {s.title}
              </h3>
              <p className="font-sans text-ivory/35 text-sm leading-relaxed group-hover:text-ivory/55 transition-colors duration-300">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div className="text-center"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7, delay: 0.3 }}>
          <Link href={ROUTES.createFragrance}
            className="btn-cta-gold inline-flex items-center gap-3 px-12 py-4 font-sans text-xs uppercase tracking-luxury font-semibold transition-all duration-300 hover:-translate-y-0.5">
            Begin Your Journey
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
