'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

// Fixed positions — avoids hydration mismatch from Math.random()
const PARTICLES = [
  { id: 0,  x: '8%',   y: '18%', s: 3,  delay: 0,   dur: 14 },
  { id: 1,  x: '15%',  y: '72%', s: 2,  delay: 2.2, dur: 11 },
  { id: 2,  x: '22%',  y: '38%', s: 4,  delay: 0.8, dur: 13 },
  { id: 3,  x: '30%',  y: '88%', s: 2,  delay: 3.5, dur: 9  },
  { id: 4,  x: '38%',  y: '12%', s: 2,  delay: 1.2, dur: 16 },
  { id: 5,  x: '72%',  y: '8%',  s: 3,  delay: 4,   dur: 12 },
  { id: 6,  x: '78%',  y: '46%', s: 2,  delay: 0.5, dur: 10 },
  { id: 7,  x: '84%',  y: '78%', s: 3,  delay: 2.8, dur: 15 },
  { id: 8,  x: '91%',  y: '25%', s: 2,  delay: 1.8, dur: 11 },
  { id: 9,  x: '5%',   y: '52%', s: 4,  delay: 3,   dur: 14 },
  { id: 10, cx: '95%', y: '62%', s: 2,  delay: 0.3, dur: 12 },
  { id: 11, x: '48%',  y: '93%', s: 2,  delay: 4.5, dur: 10 },
  { id: 12, x: '55%',  y: '5%',  s: 3,  delay: 1.5, dur: 13 },
  { id: 13, x: '18%',  y: '55%', s: 2,  delay: 3.2, dur: 9  },
  { id: 14, x: '82%',  y: '14%', s: 3,  delay: 2,   dur: 16 },
  { id: 15, x: '65%',  y: '82%', s: 2,  delay: 0.7, dur: 11 },
]

// Large outline-only bottle — decorative background element
function GhostBottle() {
  return (
    <svg
      viewBox="0 0 120 212"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Nozzle */}
      <rect x="54" y="2" width="12" height="5" rx="3" stroke="#B08D57" strokeWidth="0.7" />
      <rect x="58" y="2" width="4" height="10" rx="2" stroke="#B08D57" strokeWidth="0.7" />
      {/* Cap */}
      <rect x="38" y="7" width="44" height="20" rx="6" stroke="#B08D57" strokeWidth="0.8" />
      <rect x="43" y="11" width="12" height="12" rx="2" stroke="#B08D57" strokeWidth="0.5" strokeOpacity="0.6" />
      {/* Neck */}
      <rect x="49" y="27" width="22" height="22" stroke="#B08D57" strokeWidth="0.8" />
      {/* Shoulder */}
      <path d="M49 49 Q33 54 18 58 L102 58 Q87 54 71 49 Z" stroke="#B08D57" strokeWidth="0.8" />
      {/* Body */}
      <rect x="18" y="58" width="84" height="128" rx="10" stroke="#B08D57" strokeWidth="1.2" fill="#B08D57" fillOpacity="0.05" />
      {/* Inner highlight line */}
      <rect x="26" y="70" width="7" height="100" rx="3.5" stroke="#B08D57" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Brand letter */}
      <text
        x="60" y="130"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="36"
        fontStyle="italic"
        fill="#B08D57"
        fillOpacity="0.6"
      >
        L
      </text>
      {/* Base ellipse */}
      <ellipse cx="60" cy="192" rx="42" ry="6" stroke="#B08D57" strokeWidth="0.8" />
    </svg>
  )
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const dotY       = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOp  = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bottleY    = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const glowOp     = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-depth">

      {/* Parallax dot pattern */}
      <motion.div
        style={{ y: dotY }}
        className="absolute inset-0 opacity-[0.05] bg-dot-pattern pointer-events-none"
      />

      {/* Radial gold glow — center bloom */}
      <motion.div
        style={{ opacity: glowOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_65%_at_50%_52%,_rgba(176,141,87,0.22)_0%,_transparent_70%)]"
      />

      {/* Secondary outer fog rings */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_80%,_rgba(74,52,40,0.6)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_40%_at_50%_10%,_rgba(74,52,40,0.5)_0%,_transparent_70%)]" />

      {/* Top / bottom edge lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Diagonal accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[22%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent" />
        <div className="absolute top-0 right-[22%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent" />
      </div>

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-gold"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            animate={{ y: [0, -22, 0], opacity: [0.08, 0.45, 0.08] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Ghost bottle — large, centered, behind text */}
      <motion.div
        style={{ y: bottleY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="opacity-[0.09] w-[260px] h-[390px] md:w-[320px] md:h-[480px] lg:w-[380px] lg:h-[570px]">
          <GhostBottle />
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        style={{ opacity: contentOp }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Label */}
        <motion.p
          className="font-sans text-gold/60 text-[10px] uppercase mb-6 tracking-[0.5em]"
          initial={{ opacity: 0, letterSpacing: '0.7em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {CONFIG.brandTagline}
        </motion.p>

        {/* Brand name — cinematic large */}
        <motion.h1
          className="font-serif text-[clamp(3rem,12vw,9rem)] text-ivory leading-none tracking-widest"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {CONFIG.brandName}
        </motion.h1>

        {/* Italic subtitle */}
        <motion.p
          className="font-display text-lg md:text-2xl text-ivory/40 italic font-normal mt-5 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          Crafted for Those Who Wear Presence
        </motion.p>

        {/* Gold divider */}
        <motion.div
          className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
        />

        {/* Body copy */}
        <motion.p
          className="font-sans text-ivory/35 text-base leading-[1.8] max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
        >
          Rare ingredients. Timeless compositions.<br />
          Fragrances for those who define their own essence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
        >
          <Link
            href={ROUTES.collections}
            className="inline-flex items-center gap-3 bg-gold text-brown px-10 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-gold-light transition-colors duration-300"
          >
            Explore Collections
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-transparent text-ivory border border-ivory/20 px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:border-gold hover:text-gold transition-all duration-300"
          >
            WhatsApp Us
          </a>
        </motion.div>

        {/* Trust markers */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-1 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {['Bespoke Fragrances', 'Rare Ingredients', 'Direct Consultation'].map(t => (
            <span key={t} className="text-ivory/20 text-[10px] font-sans uppercase tracking-luxury">{t}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-ivory/20 text-[9px] font-sans uppercase tracking-luxury">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
