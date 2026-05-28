'use client'

import { motion } from 'framer-motion'
import { CONFIG } from '@/constants/config'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
}

// Fixed particle positions — no hydration mismatch
const ART_PARTICLES = [
  { id: 0,  cx: 45,  cy: 60,  r: 1.5, delay: 0,   dur: 9  },
  { id: 1,  cx: 270, cy: 45,  r: 1,   delay: 2,   dur: 11 },
  { id: 2,  cx: 30,  cy: 200, r: 2,   delay: 1.2, dur: 8  },
  { id: 3,  cx: 290, cy: 320, r: 1.5, delay: 3,   dur: 10 },
  { id: 4,  cx: 60,  cy: 340, r: 1,   delay: 0.5, dur: 12 },
  { id: 5,  cx: 255, cy: 150, r: 1.5, delay: 1.8, dur: 9  },
  { id: 6,  cx: 150, cy: 25,  r: 1,   delay: 2.5, dur: 13 },
  { id: 7,  cx: 80,  cy: 370, r: 2,   delay: 0.8, dur: 8  },
]

// Smoke wisps — animated SVG paths rising from bottle top
const WISPS = [
  { d: 'M160 95 Q155 70 162 50 Q168 30 160 10',  delay: 0,   dur: 4 },
  { d: 'M155 95 Q148 72 153 52 Q158 32 152 12',  delay: 0.8, dur: 5 },
  { d: 'M165 95 Q172 70 167 50 Q162 28 168 8',   delay: 1.6, dur: 4.5 },
]

// Ingredient element data
const INGREDIENTS = [
  { label: 'OUD',    sublabel: 'Arabic Resins',    x: 42,  y: 155, shape: 'diamond' },
  { label: 'ROSE',   sublabel: 'Grasse Petals',    x: 248, y: 235, shape: 'circle'  },
  { label: 'AMBER',  sublabel: 'Baltic Shore',     x: 42,  y: 290, shape: 'drop'    },
  { label: 'MUSK',   sublabel: 'Skin Accord',      x: 248, y: 150, shape: 'wave'    },
]

function FragranceArt() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Deep dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C0F0A] via-[#2A1812] to-[#3B2419]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.04]" />

      {/* Ambient gold glow from bottle center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_55%,_rgba(198,161,110,0.12)_0%,_transparent_70%)]" />

      <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="bs-bottle-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C6A16E" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#A07848" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7A5830" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="bs-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2A1812" />
            <stop offset="40%" stopColor="#3B2419" />
            <stop offset="100%" stopColor="#2A1812" />
          </linearGradient>
          <clipPath id="bs-clip">
            <rect x="126" y="148" width="68" height="108" rx="8" />
          </clipPath>
          <filter id="bs-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Concentric diffusion rings ── */}
        {[55, 85, 115, 145].map((r, i) => (
          <circle key={r} cx="160" cy="222" r={r} stroke="#C6A16E" strokeOpacity={0.07 - i * 0.015} strokeWidth="0.8" />
        ))}

        {/* ── Ingredient connector lines ── */}
        <line x1="72"  y1="160" x2="126" y2="185" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="3 4" />
        <line x1="248" y1="155" x2="194" y2="178" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="3 4" />
        <line x1="72"  y1="287" x2="126" y2="248" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="3 4" />
        <line x1="248" y1="240" x2="194" y2="210" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" strokeDasharray="3 4" />

        {/* ── Ingredient shapes ── */}
        {/* OUD — angular diamond */}
        <polygon points="42,140 54,155 42,170 30,155" stroke="#C6A16E" strokeOpacity="0.5" strokeWidth="0.8" fill="#C6A16E" fillOpacity="0.05" />
        <line x1="36" y1="148" x2="48" y2="162" stroke="#C6A16E" strokeOpacity="0.2" strokeWidth="0.5" />

        {/* ROSE — layered circles */}
        <circle cx="258" cy="148" r="12" stroke="#C6A16E" strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
        <circle cx="258" cy="148" r="7" stroke="#C6A16E" strokeOpacity="0.5" strokeWidth="0.8" fill="#C6A16E" fillOpacity="0.06" />
        <circle cx="258" cy="148" r="2.5" fill="#C6A16E" fillOpacity="0.4" />

        {/* AMBER — teardrop */}
        <path d="M42 272 Q35 282 42 296 Q49 282 42 272Z" stroke="#C6A16E" strokeOpacity="0.45" strokeWidth="0.8" fill="#C6A16E" fillOpacity="0.08" />

        {/* MUSK — wave lines */}
        <path d="M246 240 Q252 235 258 240 Q264 245 270 240" stroke="#C6A16E" strokeOpacity="0.4" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M246 248 Q252 243 258 248 Q264 253 270 248" stroke="#C6A16E" strokeOpacity="0.25" strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* ── Perfume bottle ── */}
        {/* Nozzle */}
        <rect x="156" y="84" width="8" height="4" rx="2" fill="#C6A16E" fillOpacity="0.6" />
        <rect x="158" y="84" width="4" height="8" rx="2" fill="#A07848" fillOpacity="0.7" />
        {/* Cap */}
        <rect x="143" y="89" width="34" height="16" rx="5" fill="#2A1812" stroke="#C6A16E" strokeOpacity="0.3" strokeWidth="0.8" />
        <rect x="146" y="92" width="10" height="10" rx="2" fill="#C6A16E" fillOpacity="0.06" />
        {/* Neck */}
        <rect x="151" y="105" width="18" height="16" rx="1" fill="#2A1812" stroke="#C6A16E" strokeOpacity="0.25" strokeWidth="0.7" />
        {/* Shoulder */}
        <path d="M151 121 Q141 125 126 128 L194 128 Q179 125 169 121Z" fill="#C6A16E" fillOpacity="0.07" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" />
        {/* Body glass */}
        <rect x="126" y="128" width="68" height="108" rx="8" fill="url(#bs-body)" stroke="#C6A16E" strokeOpacity="0.25" strokeWidth="1" />
        {/* Liquid fill */}
        <rect x="126" y="175" width="68" height="61" clipPath="url(#bs-clip)" fill="url(#bs-bottle-fill)" opacity="0.85" />
        {/* Liquid surface line */}
        <line x1="126" y1="175" x2="194" y2="175" stroke="#C6A16E" strokeOpacity="0.6" strokeWidth="0.7" />
        {/* Glass shine */}
        <rect x="132" y="136" width="5" height="88" rx="2.5" fill="white" fillOpacity="0.05" />
        {/* Brand letter */}
        <text x="160" y="162" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontStyle="italic" fill="#C6A16E" fillOpacity="0.35">L</text>
        {/* Base */}
        <ellipse cx="160" cy="238" rx="36" ry="5" fill="#C6A16E" fillOpacity="0.06" stroke="#C6A16E" strokeOpacity="0.15" strokeWidth="0.6" />
        {/* Base shadow */}
        <ellipse cx="160" cy="245" rx="28" ry="3" fill="#1C0F0A" fillOpacity="0.5" />

        {/* ── Ingredient labels ── */}
        {[
          { text: 'OUD',   sub: 'Assam · Resins',  x: 42,  y: 188 },
          { text: 'ROSE',  sub: 'Grasse · Petals',  x: 258, y: 175 },
          { text: 'AMBER', sub: 'Baltic · Shore',   x: 42,  y: 310 },
          { text: 'MUSK',  sub: 'Skin · Accord',    x: 258, y: 265 },
        ].map(({ text, sub, x, y }) => (
          <g key={text}>
            <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize="7.5" letterSpacing="2" fill="#C6A16E" fillOpacity="0.65">{text}</text>
            <text x={x} y={y + 9} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="5.5" fill="#C6A16E" fillOpacity="0.35">{sub}</text>
          </g>
        ))}

        {/* ── Particles ── */}
        {ART_PARTICLES.map(p => (
          <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#C6A16E" fillOpacity="0.2" />
        ))}

        {/* ── Corner ornaments ── */}
        <path d="M15 15 L15 35 M15 15 L35 15" stroke="#C6A16E" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
        <path d="M305 15 L305 35 M305 15 L285 15" stroke="#C6A16E" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
        <path d="M15 385 L15 365 M15 385 L35 385" stroke="#C6A16E" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
        <path d="M305 385 L305 365 M305 385 L285 385" stroke="#C6A16E" strokeOpacity="0.3" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* ── Animated smoke wisps ── */}
      {WISPS.map((w, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 320 400"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <motion.path
            d={w.d}
            stroke="#C6A16E"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.3, 0.15, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* ── Animated particles float ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {ART_PARTICLES.map(p => (
          <motion.span
            key={`f-${p.id}`}
            className="absolute w-1 h-1 rounded-full bg-gold"
            style={{ left: `${(p.cx / 320) * 100}%`, top: `${(p.cy / 400) * 100}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Vignette edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_50%,_rgba(28,15,10,0.7)_100%)] pointer-events-none" />
    </div>
  )
}

export default function BrandStory() {
  return (
    <section className="section-padding bg-depth overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Visual side ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Corner offset accents */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t border-l border-gold/30 z-10 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b border-r border-gold/30 z-10 pointer-events-none" />

            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-gold/10">
              <FragranceArt />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-brown-dark border border-gold/20 px-5 py-4 hidden sm:block z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 180 }}
            >
              <p className="font-display text-gold text-2xl font-bold leading-none">100+</p>
              <p className="font-sans text-ivory/40 text-[9px] uppercase tracking-luxury mt-1">Rare Ingredients</p>
            </motion.div>
          </motion.div>

          {/* ── Text side ── staggered reveal */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.p variants={fadeUp} className="label-luxury text-gold mb-4">Our Story</motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1] font-bold mb-6">
              Crafting Scents<br />
              <em className="not-italic text-gradient-gold">That Define Moments</em>
            </motion.h2>
            <motion.div variants={fadeUp} className="w-12 h-px bg-gold mb-8" />

            <motion.div variants={fadeUp} className="space-y-5 font-sans text-ivory/60 text-base md:text-lg leading-[1.8]">
              <p>
                Born from passion for rare ingredients and ancient perfumery traditions,{' '}
                {CONFIG.brandName} is a boutique fragrance house dedicated to the art of extraordinary scent.
              </p>
              <p>
                Each fragrance is a composition of the world&apos;s finest raw materials — hand-selected
                oud from the forests of Assam, rose absolutes from the valleys of Grasse, and rare
                ambers from the shores of the Baltic.
              </p>
              <p>
                We believe a truly exceptional fragrance does not just smell beautiful —
                it tells a story, evokes a memory, and defines who you are.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-8">
              {[
                { n: '100+', label: 'Rare Ingredients' },
                { n: 'Bespoke', label: 'Creations' },
                { n: '∞', label: 'Possibilities' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-gold/20" />}
                  <div className="text-center">
                    <p className="font-display text-3xl text-ivory font-bold">{stat.n}</p>
                    <p className="label-luxury text-gold/60 text-[9px] mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
