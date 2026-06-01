'use client'

import { motion } from 'framer-motion'
import { CONFIG } from '@/constants/config'

// Smoke wisps rising from center bottom
const WISPS = [
  { d: 'M50 100 Q47 82 50 64 Q53 46 49 28 Q46 10 50 -5',   delay: 0,   dur: 5.5 },
  { d: 'M45 100 Q42 80 44 62 Q46 44 42 26 Q39 8 43 -6',     delay: 1.4, dur: 6.5 },
  { d: 'M55 100 Q58 80 56 62 Q54 44 57 26 Q60 8 57 -6',     delay: 2.8, dur: 6   },
  { d: 'M41 100 Q38 80 40 60 Q42 40 38 22 Q35 6 38 -8',     delay: 0.7, dur: 7   },
  { d: 'M59 100 Q62 80 60 60 Q58 40 62 22 Q65 6 62 -8',     delay: 2,   dur: 6.5 },
]

const PARTICLES = [
  { left: '10%', top: '20%', delay: 0,   dur: 12, size: 2 },
  { left: '82%', top: '16%', delay: 2.2, dur: 9,  size: 1.5 },
  { left: '22%', top: '70%', delay: 1,   dur: 13, size: 1.5 },
  { left: '72%', top: '68%', delay: 3,   dur: 10, size: 2 },
  { left: '90%', top: '42%', delay: 0.8, dur: 11, size: 1 },
  { left: '6%',  top: '52%', delay: 1.8, dur: 9,  size: 1.5 },
  { left: '48%', top: '12%', delay: 3.5, dur: 14, size: 1 },
  { left: '62%', top: '85%', delay: 0.4, dur: 10, size: 1.5 },
]

export default function AboutHero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

      {/* ── Background layers ──────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#120800]" />

      {/* Ambient spotlight from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,_rgba(198,161,110,0.13)_0%,_transparent_70%)]" />

      {/* Warm glow from bottom center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,_rgba(176,96,32,0.12)_0%,_transparent_65%)]" />

      {/* Side vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_42%,_rgba(12,6,0,0.75)_100%)] pointer-events-none" />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")", mixBlendMode: 'overlay' }}
      />

      {/* Horizontal gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/20 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#C8A36A]/30 pointer-events-none" />

      {/* ── Smoke wisps ────────────────────────────────────────────────── */}
      {WISPS.map((w, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-[70%] pointer-events-none"
          aria-hidden="true"
        >
          <motion.path
            d={w.d}
            stroke="#C8A36A"
            strokeWidth="0.15"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.22, 0.12, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* ── Floating particles ─────────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#C8A36A] pointer-events-none"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -14, 0], opacity: [0.12, 0.45, 0.12] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-px w-12 bg-[#C8A36A]/40" />
          <p className="text-[#C8A36A] text-[10px] font-sans uppercase tracking-[0.35em]">
            Est. Vadodara, India
          </p>
          <div className="h-px w-12 bg-[#C8A36A]/40" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="font-display font-bold text-ivory leading-[1.08] tracking-tight mb-8"
          style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          Crafted Beyond<br />
          <span className="text-gradient-gold italic">Fragrance</span>
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A36A]/70" />
          <span className="text-[#C8A36A]/60 text-[10px]">◆</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A36A]/70" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-serif text-ivory/55 tracking-[0.18em] uppercase"
          style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          The Legacy of {CONFIG.brandName}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span className="text-[#C8A36A]/25 text-[8px] font-sans uppercase tracking-[0.25em]">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-[#C8A36A]/35 to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

      </div>
    </section>
  )
}
