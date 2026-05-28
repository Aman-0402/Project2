'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    title: "A Presence, Not Just a Scent",
    quote: "The most exquisite fragrance I have ever worn. Every time I enter a room, the compliments are immediate. It is not just a perfume — it is a presence.",
    author: "Sophia Al-Rashid",
    location: "Dubai, UAE",
    initial: "S",
    rating: 5,
  },
  {
    id: 2,
    title: "Beyond All Expectations",
    quote: "I commissioned a bespoke fragrance for my wedding. The process was intimate, thoughtful, and the result was beyond anything I imagined. A treasure I will cherish forever.",
    author: "Isabella Chen",
    location: "Singapore",
    initial: "I",
    rating: 5,
  },
  {
    id: 3,
    title: "Redefines Luxury Perfumery",
    quote: "Their Royal Oudh is unlike anything from Paris or Milan. Complex, warm, and unforgettable. This is what true luxury perfumery feels like.",
    author: "Marcus Laurent",
    location: "Paris, France",
    initial: "M",
    rating: 5,
  },
  {
    id: 4,
    title: "Scent Is Memory",
    quote: "I gifted a custom fragrance to my mother and she wept. The personal consultation, the craftsmanship — this brand understands that scent is memory.",
    author: "Layla Hassan",
    location: "Cairo, Egypt",
    initial: "L",
    rating: 5,
  },
  {
    id: 5,
    title: "A True Discovery",
    quote: "After years of mainstream perfumes, I discovered what I had been missing. The depth, the longevity, the story behind each note — truly artisan work.",
    author: "Priya Nair",
    location: "Mumbai, India",
    initial: "P",
    rating: 5,
  },
]

const TRACK = [...TESTIMONIALS, ...TESTIMONIALS]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-gold">
          <path d="M6 0l1.35 4.15H12L8.33 6.73 9.68 11 6 8.42 2.32 11l1.35-4.27L0 4.15h4.65z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [paused, setPaused] = useState(false)

  return (
    <section className="py-28 bg-depth relative overflow-hidden">
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_50%,_rgba(198,161,110,0.07)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Giant decorative quote mark */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif leading-none select-none pointer-events-none text-gold/[0.025] testimonials-quote-bg"
        aria-hidden="true"
      >
        &#8220;
      </div>

      {/* Header */}
      <motion.div
        className="container-luxury text-center mb-16 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="label-luxury mb-3">Voices</p>
        <h2 className="heading-luxury text-ivory">Client Testimonials</h2>
        <div className="gold-divider mx-auto" />
        <p className="font-sans text-ivory/35 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Words from those who have experienced our fragrances firsthand
        </p>
      </motion.div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-28 md:w-40 bg-gradient-to-r from-[#2A1812] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 md:w-40 bg-gradient-to-l from-[#2A1812] to-transparent z-10 pointer-events-none" />

        <div
          className={`flex gap-8 w-max py-4 px-4 testimonials-track${paused ? ' testimonials-track-paused' : ''}`}
        >
          {TRACK.map((t, idx) => (
            <motion.div
              key={idx}
              className="w-[340px] sm:w-[380px] flex-shrink-0 cursor-default"
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="testimonials-card-shadow h-full p-8 bg-white/[0.04] border border-ivory/10 hover:border-gold/35 transition-colors duration-500 relative overflow-hidden"
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-gold/40" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-gold/40" />

                {/* Inner glow on hover (handled by border + shadow) */}

                {/* Stars */}
                <Stars count={t.rating} />

                {/* Card title */}
                <p className="font-serif text-gold/90 text-base italic mb-3">
                  &ldquo;{t.title}&rdquo;
                </p>

                {/* Decorative large quote */}
                <div
                  className="testimonials-quote-mark font-serif text-gold/10 leading-none mb-1 select-none"
                  aria-hidden="true"
                >
                  &#8220;
                </div>

                {/* Quote body */}
                <p className="font-serif text-sm text-ivory/55 leading-[1.9] italic mb-7">
                  {t.quote}
                </p>

                {/* Divider */}
                <div className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent mb-5" />

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-base text-gold">{t.initial}</span>
                  </div>

                  {/* Name + location */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-ivory/85 font-medium leading-none mb-1">{t.author}</p>
                    <div className="flex items-center gap-1">
                      <svg viewBox="0 0 10 13" fill="currentColor" className="w-2 h-2.5 text-gold/40 flex-shrink-0">
                        <path d="M5 0C2.8 0 1 1.8 1 4c0 3 4 9 4 9s4-6 4-9c0-2.2-1.8-4-4-4zm0 5.5C4.2 5.5 3.5 4.8 3.5 4S4.2 2.5 5 2.5 6.5 3.2 6.5 4 5.8 5.5 5 5.5z" />
                      </svg>
                      <p className="font-sans text-[9px] text-gold/45 uppercase tracking-luxury truncate">{t.location}</p>
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="flex items-center gap-1 border border-gold/20 px-2 py-1 flex-shrink-0">
                    <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 flex-shrink-0">
                      <circle cx="7" cy="7" r="5.5" stroke="#C6A16E" strokeOpacity="0.5" strokeWidth="1" />
                      <path d="M4.5 7l1.8 1.8 3.2-3.3" stroke="#C6A16E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-sans text-[7px] text-gold/45 uppercase tracking-luxury">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  )
}
