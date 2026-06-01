'use client'

import { motion } from 'framer-motion'

const WISPS = [
  { d: 'M50 100 Q47 82 50 64 Q53 46 49 28 Q46 10 50 -5',  delay: 0,   dur: 5.5 },
  { d: 'M44 100 Q41 80 43 62 Q45 44 41 26 Q38 8 42 -6',   delay: 1.4, dur: 7   },
  { d: 'M56 100 Q59 80 57 62 Q55 44 58 26 Q61 8 58 -6',   delay: 2.8, dur: 6   },
  { d: 'M38 100 Q35 78 38 58 Q40 38 36 20 Q33 4 37 -8',   delay: 0.7, dur: 7.5 },
  { d: 'M62 100 Q65 78 62 58 Q60 38 64 20 Q67 4 63 -8',   delay: 2.1, dur: 6.5 },
  { d: 'M30 100 Q27 76 31 56 Q33 36 29 16 Q26 2 30 -10',  delay: 3.2, dur: 8   },
  { d: 'M70 100 Q73 76 69 56 Q67 36 71 16 Q74 2 70 -10',  delay: 1.0, dur: 7   },
  { d: 'M22 100 Q20 78 23 58 Q25 38 21 18',               delay: 0.5, dur: 9   },
  { d: 'M78 100 Q80 78 77 58 Q75 38 79 18',               delay: 2.5, dur: 8.5 },
]

const PARTICLES = [
  { left: '10%', top: '22%', delay: 0,   dur: 12, size: 2,   glow: 0.55 },
  { left: '84%', top: '16%', delay: 2.2, dur: 9,  size: 1.5, glow: 0.40 },
  { left: '20%', top: '68%', delay: 1,   dur: 13, size: 1.5, glow: 0.45 },
  { left: '74%', top: '72%', delay: 3,   dur: 10, size: 2,   glow: 0.55 },
  { left: '91%', top: '44%', delay: 0.8, dur: 11, size: 1,   glow: 0.30 },
  { left: '5%',  top: '54%', delay: 1.8, dur: 9,  size: 1.5, glow: 0.45 },
  { left: '50%', top: '12%', delay: 3.5, dur: 14, size: 1,   glow: 0.30 },
  { left: '63%', top: '84%', delay: 0.4, dur: 10, size: 1.5, glow: 0.40 },
  { left: '33%', top: '38%', delay: 1.6, dur: 11, size: 2,   glow: 0.60 },
  { left: '77%', top: '30%', delay: 2.9, dur: 8,  size: 1.5, glow: 0.40 },
  { left: '15%', top: '85%', delay: 0.3, dur: 12, size: 1,   glow: 0.30 },
  { left: '88%', top: '78%', delay: 3.8, dur: 9,  size: 2,   glow: 0.50 },
]

const AMBER_BLOBS = [
  { left: '15%', top: '30%', w: 280, h: 280, opacity: 0.07, dur: 8,  delay: 0   },
  { left: '65%', top: '50%', w: 340, h: 240, opacity: 0.06, dur: 11, delay: 2.5 },
  { left: '40%', top: '70%', w: 300, h: 200, opacity: 0.08, dur: 9,  delay: 1.2 },
]

export default function ContactHero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">

      {/* ── Base background ──────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#0D0700]" />

      {/* Rotating cinematic light beam */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(198,161,110,0.055) 28deg, transparent 56deg, transparent 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {/* Central radial glow behind typography */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_45%,_rgba(198,161,110,0.18)_0%,_transparent_68%)] pointer-events-none" />

      {/* Top spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,_rgba(198,161,110,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Warm amber bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_100%,_rgba(176,96,32,0.16)_0%,_transparent_65%)] pointer-events-none" />

      {/* Vertical light shaft */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3/4 bg-gradient-to-b from-[#C8A36A]/22 to-transparent pointer-events-none" />
      <div className="cta-light-shaft absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1/2 bg-gradient-to-b from-[#C8A36A]/04 to-transparent pointer-events-none" />

      {/* Animated amber light blobs */}
      {AMBER_BLOBS.map((b, i) => (
        <motion.div key={i}
          className="amber-blob absolute rounded-full pointer-events-none"
          style={{ left: b.left, top: b.top, width: b.w, height: b.h, opacity: b.opacity }}
          animate={{ opacity: [b.opacity * 0.6, b.opacity, b.opacity * 0.6], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_40%,_rgba(10,5,0,0.82)_100%)] pointer-events-none" />

      {/* Cinematic grain */}
      <div className="cta-grain absolute inset-0 opacity-[0.038] pointer-events-none" />

      {/* Horizon lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/18 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#C8A36A]/30 pointer-events-none" />

      {/* ── Smoke wisps ───────────────────────────────────────────────── */}
      {WISPS.map((w, i) => (
        <motion.svg key={i} viewBox="0 0 100 100" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-[72%] pointer-events-none" aria-hidden="true">
          <motion.path d={w.d} stroke="#C8A36A" strokeWidth="0.18" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.26, 0.13, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* ── Glowing particles ─────────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full bg-[#C8A36A] pointer-events-none"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            boxShadow: `0 0 ${p.size * 5}px ${p.size * 2}px rgba(200,163,106,${p.glow})`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.12, 0.55, 0.12] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

        {/* Eyebrow */}
        <motion.div className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="h-px w-12 bg-[#C8A36A]/40" />
          <p className="text-[#C8A36A] text-[10px] font-sans uppercase tracking-[0.35em]">Visit Us</p>
          <div className="h-px w-12 bg-[#C8A36A]/40" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="contact-hero-heading font-display font-bold text-ivory leading-[1.08] tracking-tight mb-6"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}>
          Discover A Scent<br />
          <span className="text-gradient-gold italic">That Becomes You</span>
        </motion.h1>

        {/* Divider */}
        <motion.div className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}>
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C8A36A]/65" />
          <span className="text-[#C8A36A]/55 text-[10px]">◆</span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C8A36A]/65" />
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="contact-hero-sub font-serif italic text-ivory/52 leading-relaxed"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.4, 0, 0.2, 1] }}>
          Visit our atelier, speak with fragrance specialists,<br className="hidden sm:block" />
          and discover scents crafted around your identity.
        </motion.p>

      </div>
    </section>
  )
}
