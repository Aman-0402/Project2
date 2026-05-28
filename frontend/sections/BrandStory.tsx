'use client'

import { motion } from 'framer-motion'
import { CONFIG } from '@/constants/config'

export default function BrandStory() {
  return (
    <section className="section-padding bg-depth overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Decorative frame */}
            <div className="relative aspect-[4/5] bg-brown-light/30 border border-gold/20">
              {/* Offset border accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold/40" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gold/40" />

              {/* Inner content */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-px bg-gold mx-auto mb-6" />
                  <p className="font-serif text-5xl md:text-7xl text-ivory/10 select-none">
                    {CONFIG.brandName[0]}
                  </p>
                  <p className="font-serif text-ivory/20 text-sm tracking-wide mt-4">
                    {CONFIG.brandName}
                  </p>
                  <div className="w-16 h-px bg-gold mx-auto mt-6" />
                </div>
              </div>

              {/* Gold dot accents */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold/40" />
              <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-gold/40" />
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="label-luxury text-gold mb-4">Our Story</p>
            <h2 className="font-serif text-4xl md:text-5xl text-ivory leading-tight mb-6">
              Crafting Scents That<br />
              <em className="not-italic text-gradient-gold">Define Moments</em>
            </h2>
            <div className="w-12 h-px bg-gold mb-8" />
            <div className="space-y-4 font-sans text-ivory/60 text-sm leading-relaxed">
              <p>
                Born from a passion for rare ingredients and ancient perfumery traditions,
                {CONFIG.brandName} is a boutique fragrance house dedicated to the art of extraordinary scent.
              </p>
              <p>
                Each fragrance is a composition of the world&apos;s finest raw materials — hand-selected
                oud from the forests of Assam, rose absolutes from the valleys of Grasse, and rare
                ambers from the shores of the Baltic.
              </p>
              <p>
                We believe that a truly exceptional fragrance does not just smell beautiful —
                it tells a story, evokes a memory, and defines who you are.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="text-center">
                <p className="font-serif text-3xl text-ivory">100+</p>
                <p className="label-luxury text-gold/70 text-[9px] mt-1">Rare Ingredients</p>
              </div>
              <div className="w-px h-10 bg-gold/20" />
              <div className="text-center">
                <p className="font-serif text-3xl text-ivory">Bespoke</p>
                <p className="label-luxury text-gold/70 text-[9px] mt-1">Creations</p>
              </div>
              <div className="w-px h-10 bg-gold/20" />
              <div className="text-center">
                <p className="font-serif text-3xl text-ivory">∞</p>
                <p className="label-luxury text-gold/70 text-[9px] mt-1">Possibilities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
