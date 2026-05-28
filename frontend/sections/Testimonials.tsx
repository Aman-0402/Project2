'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The most exquisite fragrance I have ever worn. Every time I enter a room, the compliments are immediate. It is not just a perfume — it is a presence.",
    author: "Sophia Al-Rashid",
    title: "Dubai",
  },
  {
    id: 2,
    quote: "I commissioned a bespoke fragrance for my wedding. The process was intimate, thoughtful, and the result was beyond anything I imagined. A treasure I will cherish forever.",
    author: "Isabella Chen",
    title: "Singapore",
  },
  {
    id: 3,
    quote: "Their Royal Oudh is unlike anything from Paris or Milan. Complex, warm, and unforgettable. This is what true luxury perfumery feels like.",
    author: "Marcus Laurent",
    title: "Paris",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="section-padding bg-beige overflow-hidden relative">
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="label-luxury mb-3">Voices</p>
          <h2 className="heading-luxury">What Our Clients Say</h2>
          <div className="gold-divider mx-auto mt-6" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Quote display */}
          <div className="relative min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Quotation mark */}
                <div className="font-serif text-6xl text-gold/20 leading-none mb-4 select-none">&ldquo;</div>
                <p className="font-serif text-xl md:text-2xl text-brown leading-relaxed italic px-4">
                  {TESTIMONIALS[active].quote}
                </p>
                <div className="w-8 h-px bg-gold mx-auto mt-8 mb-4" />
                <p className="font-sans text-sm text-brown font-medium">{TESTIMONIALS[active].author}</p>
                <p className="label-luxury text-[9px] text-gold/70 mt-1">{TESTIMONIALS[active].title}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center mt-12">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <span className={`block transition-all duration-300 ${
                  i === active
                    ? 'w-8 h-px bg-gold'
                    : 'w-2 h-2 rounded-full bg-gold/30 hover:bg-gold/60'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
