import type { Metadata } from 'next'
import Link from 'next/link'
import { CONFIG, ROUTES } from '@/constants/config'
import AboutHero from './AboutHero'
import AboutCTA from './AboutCTA'

export const metadata: Metadata = {
  title: 'About',
  description: `The story behind ${CONFIG.brandName} — a boutique luxury fragrance house dedicated to extraordinary scents.`,
}

const PILLARS = [
  {
    num: '01',
    title: 'Rare Ingredients',
    body: 'We source only the finest raw materials — oud from Assam, rose from Grasse, amber from the Baltic — each selected for depth, longevity, and character.',
    stat: { value: '100+', label: 'Unique Botanicals' },
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l4 8H28l-6.5 5.5 2.5 8.5L16 21l-8 4 2.5-8.5L4 11h8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 11h12M16 3v18" strokeOpacity="0.45" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Master Craftsmanship',
    body: 'Every fragrance is composed by hand, drawing on centuries-old perfumery traditions blended with a modern sensibility that is distinctly our own.',
    quote: '"Unhurried. Uncompromising. Crafted by hand."',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 24c0-4 2-6 4-8l2-8 2 8c2 2 4 4 4 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16c0 0 1-2 4-2s4 2 4 2" />
        <circle cx="16" cy="6" r="2" />
        <path strokeLinecap="round" d="M6 28h20" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Bespoke Creation',
    body: 'For those who desire something truly unique, we offer an intimate bespoke service — a personal fragrance crafted to your story, your memory, your identity.',
    cta: true,
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 22L14 8l3 6 4-4 5 12" />
        <path strokeLinecap="round" d="M4 26h24" strokeOpacity="0.35" />
        <circle cx="14" cy="8" r="1.5" fill="currentColor" fillOpacity="0.4" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <AboutHero />

      {/* Philosophy — editorial split layout */}
      <section className="section-padding overflow-hidden">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* ── Left: Visual collage ─────────────────────────────── */}
            <div className="relative order-2 lg:order-1 pb-10 lg:pb-0">
              {/* Corner accent */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-gold/25 z-10 pointer-events-none" />

              {/* Main tall image — bottle / atelier */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-brown-dark via-brown to-[#3B2419]">
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.04]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_40%,_rgba(198,161,110,0.10)_0%,_transparent_70%)]" />
                {/* Centre ornament */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-px bg-gold/30" />
                  <p className="font-serif text-ivory/15 text-sm uppercase tracking-[0.3em]">Atelier</p>
                  <div className="w-8 h-px bg-gold/30" />
                </div>
                {/* Bottom vignette */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brown-dark/60 to-transparent" />
              </div>

              {/* Smaller offset image — ingredient / detail */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 w-[42%] aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#3B2419] to-brown-dark border-2 border-ivory shadow-2xl z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,_rgba(198,161,110,0.09)_0%,_transparent_70%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-px bg-gold/30" />
                  <p className="font-serif text-ivory/12 text-[10px] uppercase tracking-[0.25em]">Ingredient</p>
                  <div className="w-6 h-px bg-gold/30" />
                </div>
              </div>

              {/* Floating stat badge */}
              <div className="absolute top-6 -right-4 lg:-right-8 bg-brown border border-gold/20 px-5 py-4 z-10">
                <p className="font-display text-gold text-2xl font-bold leading-none">100+</p>
                <p className="font-sans text-ivory/35 text-[9px] uppercase tracking-luxury mt-1">Rare Ingredients</p>
              </div>
            </div>

            {/* ── Right: Story text ─────────────────────────────────── */}
            <div className="order-1 lg:order-2">
              <p className="label-luxury mb-5">The Philosophy</p>

              {/* Two-line heading */}
              <h2 className="about-heading-primary font-display font-bold text-brown leading-[1.05] mb-1">
                Fragrance Is Not Worn
              </h2>
              <h2 className="about-heading-italic font-serif font-light italic text-gradient-gold leading-[1.1] mb-8">
                It Is Remembered
              </h2>

              <div className="w-12 h-px bg-gold mb-8" />

              <div className="space-y-5 font-sans text-base text-brown/65 leading-[1.85]">
                <p>
                  {CONFIG.brandName} was founded on a singular belief: that truly exceptional
                  fragrance transcends the ordinary. It does not merely smell beautiful —
                  it speaks, it tells a story, it becomes part of who you are.
                </p>
                <p>
                  We began as a small atelier with a master perfumer and a collection of rare
                  ingredients gathered from across the world. Today, every bottle we create
                  carries that same intimate dedication — unhurried, uncompromising, and crafted
                  for those who recognize the difference.
                </p>
              </div>

              {/* Signature quote */}
              <blockquote className="mt-10 pl-6 border-l-2 border-gold/35">
                <p className="font-serif text-xl md:text-2xl text-brown/75 italic leading-relaxed">
                  &ldquo;The finest things in life are rarely found,<br className="hidden sm:block" /> and always felt.&rdquo;
                </p>
                <p className="mt-3 text-[10px] font-sans uppercase tracking-[0.25em] text-gold/60">
                  — {CONFIG.brandName}
                </p>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding bg-beige overflow-hidden">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="label-luxury mb-3">What We Stand For</p>
            <h2 className="heading-luxury">Our Pillars</h2>
            <div className="gold-divider mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PILLARS.map((pillar) => (
              <div key={pillar.title}
                className="pillar-card group relative bg-ivory/75 border border-gold/18 backdrop-blur-sm p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-ivory hover:border-gold/40 cursor-default"
              >
                {/* Hover glow layer */}
                <div className="pillar-card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />

                {/* Number */}
                <p className="absolute top-5 right-6 font-display text-[2.5rem] font-bold text-gold/08 group-hover:text-gold/14 transition-colors duration-500 leading-none select-none">
                  {pillar.num}
                </p>

                {/* Icon */}
                <div className="text-gold/55 group-hover:text-gold transition-colors duration-300 mb-6">
                  {pillar.icon}
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-brown mb-3 group-hover:text-brown-dark transition-colors duration-300">
                  {pillar.title}
                </h3>

                {/* Divider */}
                <div className="w-8 h-px bg-gold/40 group-hover:w-14 group-hover:bg-gold/65 transition-all duration-500 mb-5" />

                {/* Body */}
                <p className="font-sans text-sm text-brown/58 leading-relaxed group-hover:text-brown/75 transition-colors duration-300">
                  {pillar.body}
                </p>

                {/* Quote (Craftsmanship card only — makes it taller) */}
                {'quote' in pillar && pillar.quote && (
                  <p className="mt-6 font-serif text-base italic text-brown/45 group-hover:text-gold/65 transition-colors duration-300 border-l border-gold/25 pl-4">
                    {pillar.quote}
                  </p>
                )}

                {/* Stat (Ingredients card only — makes it taller) */}
                {'stat' in pillar && pillar.stat && (
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-brown">{pillar.stat.value}</span>
                    <span className="text-[10px] font-sans uppercase tracking-luxury text-brown/40">{pillar.stat.label}</span>
                  </div>
                )}

                {/* CTA (Bespoke card only) */}
                {'cta' in pillar && pillar.cta && (
                  <Link href={ROUTES.createFragrance}
                    className="inline-flex items-center gap-2 mt-6 text-[10px] font-sans uppercase tracking-luxury text-gold/60 hover:text-gold transition-colors duration-200">
                    Begin Your Journey
                    <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutCTA />
    </div>
  )
}
