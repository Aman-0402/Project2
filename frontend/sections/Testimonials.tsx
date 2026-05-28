'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The most exquisite fragrance I have ever worn. Every time I enter a room, the compliments are immediate. It is not just a perfume — it is a presence.",
    author: "Sophia Al-Rashid",
    location: "Dubai",
    initial: "S",
  },
  {
    id: 2,
    quote: "I commissioned a bespoke fragrance for my wedding. The process was intimate, thoughtful, and the result was beyond anything I imagined. A treasure I will cherish forever.",
    author: "Isabella Chen",
    location: "Singapore",
    initial: "I",
  },
  {
    id: 3,
    quote: "Their Royal Oudh is unlike anything from Paris or Milan. Complex, warm, and unforgettable. This is what true luxury perfumery feels like.",
    author: "Marcus Laurent",
    location: "Paris",
    initial: "M",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <section
      className="section-padding bg-depth relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,_rgba(198,161,110,0.05)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />

      {/* Top / bottom lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Decorative large quote mark behind content */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 font-serif text-[200px] text-gold/[0.03] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="relative container-luxury">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">Voices</p>
          <h2 className="heading-luxury text-ivory">What Our Clients Say</h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        {/* ── Desktop: 3 cards ── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setActive(i)}
              className={`text-left p-8 border transition-all duration-500 cursor-pointer relative overflow-hidden ${
                i === active
                  ? 'bg-white/[0.05] border-gold/40 backdrop-blur-sm'
                  : 'bg-white/[0.02] border-ivory/8 hover:border-gold/20'
              }`}
              animate={{ scale: i === active ? 1.02 : 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Gold quote mark */}
              <div className="font-serif text-4xl text-gold/30 leading-none mb-5 select-none">&ldquo;</div>

              {/* Quote */}
              <p className={`font-serif text-base leading-[1.8] italic mb-6 transition-colors duration-300 ${
                i === active ? 'text-ivory/80' : 'text-ivory/40'
              }`}>
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  i === active ? 'border-gold/60 bg-gold/10' : 'border-ivory/15 bg-ivory/5'
                }`}>
                  <span className={`font-serif text-sm transition-colors duration-300 ${
                    i === active ? 'text-gold' : 'text-ivory/30'
                  }`}>{t.initial}</span>
                </div>
                <div>
                  <p className={`font-sans text-sm font-medium transition-colors duration-300 ${
                    i === active ? 'text-ivory' : 'text-ivory/40'
                  }`}>{t.author}</p>
                  <p className="label-luxury text-[9px] text-gold/50 mt-0.5">{t.location}</p>
                </div>
              </div>

              {/* Active indicator line */}
              {i === active && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
                  layoutId="active-bar"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* ── Mobile: single card with AnimatePresence ── */}
        <div className="lg:hidden max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="p-8 bg-white/[0.04] border border-gold/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="font-serif text-4xl text-gold/30 leading-none mb-5">&ldquo;</div>
              <p className="font-serif text-lg leading-[1.8] italic text-ivory/70 mb-6">
                {TESTIMONIALS[active].quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-gold/50 bg-gold/10 flex items-center justify-center">
                  <span className="font-serif text-sm text-gold">{TESTIMONIALS[active].initial}</span>
                </div>
                <div>
                  <p className="font-sans text-sm text-ivory font-medium">{TESTIMONIALS[active].author}</p>
                  <p className="label-luxury text-[9px] text-gold/50 mt-0.5">{TESTIMONIALS[active].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <motion.span
                className="block rounded-full bg-gold"
                animate={{ width: i === active ? 28 : 6, height: i === active ? 2 : 6, opacity: i === active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>

        {/* Auto-progress hint */}
        <p className="text-center font-sans text-[10px] text-ivory/20 uppercase tracking-luxury mt-4">
          {paused ? 'Paused' : 'Auto-advancing'}
        </p>
      </div>
    </section>
  )
}
