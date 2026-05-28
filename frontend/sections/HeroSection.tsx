'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

// Fixed positions — no Math.random() = no hydration mismatch
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
  { id: 10, x: '95%',  y: '62%', s: 2,  delay: 0.3, dur: 12 },
  { id: 11, x: '48%',  y: '93%', s: 2,  delay: 4.5, dur: 10 },
  { id: 12, x: '55%',  y: '5%',  s: 3,  delay: 1.5, dur: 13 },
  { id: 13, x: '18%',  y: '55%', s: 2,  delay: 3.2, dur: 9  },
  { id: 14, x: '82%',  y: '14%', s: 3,  delay: 2,   dur: 16 },
  { id: 15, x: '65%',  y: '82%', s: 2,  delay: 0.7, dur: 11 },
]

const FRAGRANCE_NOTES = [
  { id: 0, label: 'Oud',        x: '7%',  y: '33%', delay: 0,   dur: 13 },
  { id: 1, label: 'Amber',      x: '10%', y: '62%', delay: 2,   dur: 15 },
  { id: 2, label: 'Saffron',    x: '87%', y: '28%', delay: 1,   dur: 12 },
  { id: 3, label: 'Sandalwood', x: '83%', y: '58%', delay: 3,   dur: 14 },
  { id: 4, label: 'Rose',       x: '5%',  y: '48%', delay: 1.5, dur: 11 },
  { id: 5, label: 'Musk',       x: '90%', y: '44%', delay: 0.7, dur: 13 },
]

// Smoke wisps — paths in GhostBottle's viewBox (120×212), nozzle at ~(60,2)
const SMOKE_WISPS = [
  { d: 'M60 2 Q55 -14 62 -34 Q68 -54 59 -76',  delay: 0,   dur: 4.5 },
  { d: 'M57 2 Q49 -17 55 -39 Q61 -61 51 -83',  delay: 0.9, dur: 5.5 },
  { d: 'M63 2 Q71 -12 65 -33 Q58 -54 67 -74',  delay: 1.8, dur: 5   },
]

function GhostBottle() {
  return (
    <svg
      viewBox="0 0 120 212"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <filter id="hero-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="hero-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C6A16E" stopOpacity="0" />
          <stop offset="50%" stopColor="#C6A16E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C6A16E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Nozzle */}
      <rect x="54" y="2" width="12" height="5" rx="3" stroke="#C6A16E" strokeWidth="0.8" filter="url(#hero-glow)" />
      <rect x="58" y="2" width="4" height="10" rx="2" stroke="#C6A16E" strokeWidth="0.8" />
      {/* Cap */}
      <rect x="38" y="7" width="44" height="20" rx="6" stroke="#C6A16E" strokeWidth="0.9" filter="url(#hero-glow)" />
      <rect x="43" y="11" width="12" height="12" rx="2" stroke="#C6A16E" strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Neck */}
      <rect x="49" y="27" width="22" height="22" stroke="#C6A16E" strokeWidth="0.8" />
      {/* Shoulder */}
      <path d="M49 49 Q33 54 18 58 L102 58 Q87 54 71 49 Z" stroke="#C6A16E" strokeWidth="0.8" strokeOpacity="0.9" />
      {/* Body */}
      <rect x="18" y="58" width="84" height="128" rx="10" stroke="#C6A16E" strokeWidth="1.4" fill="#C6A16E" fillOpacity="0.04" filter="url(#hero-glow)" />
      {/* Glass reflection streak */}
      <rect x="26" y="70" width="6" height="100" rx="3" fill="#C6A16E" fillOpacity="0.12" />
      {/* Second highlight */}
      <rect x="34" y="80" width="2.5" height="70" rx="1.25" fill="#C6A16E" fillOpacity="0.06" />
      {/* Brand letter */}
      <text x="60" y="130" textAnchor="middle" fontFamily="Georgia, serif" fontSize="36" fontStyle="italic" fill="#C6A16E" fillOpacity="0.55">
        {CONFIG.brandName[0]}
      </text>
      {/* Base ellipse */}
      <ellipse cx="60" cy="192" rx="42" ry="6" stroke="#C6A16E" strokeWidth="0.9" filter="url(#hero-glow)" />
    </svg>
  )
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const dotY      = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOp = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bottleY   = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const glowOp    = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Mouse-reactive ambient glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 55, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 55, damping: 22 })
  const mouseGlow = useMotionTemplate`radial-gradient(ellipse 650px 520px at ${springX}px ${springY}px, rgba(198,161,110,0.08), transparent 72%)`

  useEffect(() => {
    if (typeof window === 'undefined') return
    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-hero">

      {/* ── Layer 1: Parallax dot texture ── */}
      <motion.div
        style={{ y: dotY }}
        className="absolute inset-0 opacity-[0.04] bg-dot-pattern pointer-events-none"
      />

      {/* ── Layer 2: Mouse-reactive gold glow ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: mouseGlow }} />

      {/* ── Layer 3: Static ambient glows ── */}
      <motion.div
        style={{ opacity: glowOp }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_65%_at_50%_52%,_rgba(198,161,110,0.16)_0%,_transparent_70%)]"
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_85%,_rgba(28,15,10,0.7)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_40%_at_50%_8%,_rgba(28,15,10,0.55)_0%,_transparent_70%)]" />

      {/* ── Layer 4: Edge lines ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      {/* ── Layer 5: Animated vertical light rays ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-[22%] w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent"
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 right-[22%] w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent"
          animate={{ opacity: [0.04, 0.10, 0.04] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <motion.div
          className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent"
          animate={{ opacity: [0.02, 0.06, 0.02] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* ── Layer 6: Floating gold particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-gold"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            animate={{ y: [0, -24, 0], opacity: [0.06, 0.5, 0.06] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Layer 7: Floating fragrance note labels ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
        {FRAGRANCE_NOTES.map(n => (
          <motion.span
            key={n.id}
            className="absolute font-sans text-[10px] uppercase tracking-[0.25em] text-gold/25 select-none"
            style={{ left: n.x, top: n.y }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {n.label}
          </motion.span>
        ))}
      </div>

      {/* ── Layer 8: Ghost bottle + smoke ── */}
      <motion.div
        style={{ y: bottleY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        {/* Gold bloom behind bottle */}
        <div className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] lg:w-[340px] lg:h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(198,161,110,0.14)_0%,_transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Bottle */}
        <div className="opacity-[0.20] w-[240px] h-[360px] md:w-[300px] md:h-[450px] lg:w-[360px] lg:h-[540px] relative">
          <GhostBottle />

          {/* Smoke wisps — overlay on same viewBox */}
          <svg
            viewBox="0 0 120 212"
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            aria-hidden="true"
          >
            {SMOKE_WISPS.map((w, i) => (
              <motion.path
                key={i}
                d={w.d}
                stroke="#C6A16E"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.35, 0.18, 0] }}
                transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        </div>

        {/* Animated shine sweep across bottle */}
        <motion.div
          className="absolute w-[4px] h-[360px] md:h-[450px] lg:h-[540px] bg-gradient-to-b from-transparent via-gold/30 to-transparent"
          animate={{ x: ['-160px', '160px'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, delay: 2, repeat: Infinity, repeatDelay: 6, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>

      {/* ── Layer 9: Main content ── */}
      <motion.div
        style={{ opacity: contentOp }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow label */}
        <motion.p
          className="font-sans text-gold/55 text-[10px] uppercase mb-8 tracking-[0.55em]"
          initial={{ opacity: 0, letterSpacing: '0.75em' }}
          animate={{ opacity: 1, letterSpacing: '0.55em' }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {CONFIG.brandTagline}
        </motion.p>

        {/* Brand name */}
        <motion.h1
          className="font-serif text-[clamp(4rem,11vw,9.5rem)] text-ivory leading-[0.95] tracking-[0.12em] mb-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {CONFIG.brandName}
        </motion.h1>

        {/* Italic subtitle — bigger + more contrast */}
        <motion.p
          className="font-display text-xl md:text-3xl text-ivory/65 italic font-normal tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          Crafted for Those Who Wear Presence
        </motion.p>

        {/* Gold divider */}
        <motion.div
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.8 }}
        />

        {/* Body copy — improved contrast + width */}
        <motion.p
          className="font-sans text-ivory/72 text-base md:text-lg leading-[1.9] max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          Rare ingredients. Timeless compositions.<br />
          Fragrances for those who define their own essence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link href={ROUTES.collections} className="btn-luxury">
            Discover the Collection
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link href={ROUTES.createFragrance} className="btn-luxury-dark">
            Create Your Fragrance
          </Link>
        </motion.div>

        {/* Trust markers — improved contrast */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-1 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {['Bespoke Fragrances', 'Rare Ingredients', 'Direct Consultation'].map(t => (
            <span key={t} className="text-ivory/35 text-[10px] font-sans uppercase tracking-luxury">{t}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-ivory/25 text-[9px] font-sans uppercase tracking-luxury">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent"
          animate={{ scaleY: [1, 0.25, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
