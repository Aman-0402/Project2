import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

export const metadata: Metadata = {
  title: 'About',
  description: `The story behind ${CONFIG.brandName} — a boutique luxury fragrance house dedicated to extraordinary scents.`,
}

const PILLARS = [
  {
    title: 'Rare Ingredients',
    body: 'We source only the finest raw materials — oud from Assam, rose from Grasse, amber from the Baltic — each selected for depth, longevity, and character.',
  },
  {
    title: 'Master Craftsmanship',
    body: 'Every fragrance is composed by hand, drawing on centuries-old perfumery traditions blended with a modern sensibility that is distinctly our own.',
  },
  {
    title: 'Bespoke Creation',
    body: 'For those who desire something truly unique, we offer an intimate bespoke service — a personal fragrance crafted to your story, your memory, your identity.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <div className="bg-brown py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20" />
        <div className="container-luxury text-center relative">
          <p className="label-luxury text-gold mb-4">Our Story</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide">About Us</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>
      </div>

      {/* Story */}
      <section className="section-padding">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <p className="label-luxury mb-4">The Philosophy</p>
          <h2 className="heading-luxury mb-6">
            Fragrance Is Not Worn —<br />
            <em className="not-italic text-gradient-gold">It Is Lived</em>
          </h2>
          <div className="gold-divider mx-auto mb-8" />
          <div className="space-y-5 font-sans text-sm text-brown/70 leading-relaxed">
            <p>
              {CONFIG.brandName} was founded on a singular belief: that truly exceptional fragrance
              transcends the ordinary. It does not merely smell beautiful — it speaks, it tells a story,
              it becomes part of who you are.
            </p>
            <p>
              We began as a small atelier with a master perfumer and a collection of rare ingredients
              gathered from across the world. Today, every bottle we create carries that same intimate
              dedication — unhurried, uncompromising, and crafted for those who recognize the difference.
            </p>
            <p>
              Our fragrances are not made for the masses. They are made for individuals
              who understand that the finest things in life are rarely found, and always felt.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding bg-beige">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <p className="label-luxury mb-3">What We Stand For</p>
            <h2 className="heading-luxury">Our Pillars</h2>
            <div className="gold-divider mx-auto mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className="text-center p-8 bg-ivory border border-beige-dark"
              >
                <div className="w-8 h-px bg-gold mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-brown mb-4">{pillar.title}</h3>
                <p className="font-sans text-sm text-brown/60 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brown text-center">
        <div className="container-luxury max-w-xl mx-auto">
          <p className="label-luxury text-gold mb-4">Experience It</p>
          <h2 className="font-serif text-4xl text-ivory mb-6">Begin Your Journey</h2>
          <div className="w-10 h-px bg-gold mx-auto mb-8" />
          <p className="font-sans text-sm text-ivory/50 mb-8">
            Explore our collection or reach out on WhatsApp for a personal consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={ROUTES.collections}
              className="inline-flex items-center gap-2 bg-gold text-ivory px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
            >
              Explore Collections
            </Link>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent text-ivory border border-ivory/20 px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:border-gold hover:text-gold transition-all duration-300"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
