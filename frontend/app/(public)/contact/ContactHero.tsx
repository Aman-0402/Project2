'use client'

import { motion } from 'framer-motion'

const WISPS = [
  { d: 'M50 100 Q47 82 50 64 Q53 46 49 28 Q46 10 50 -5',  delay: 0,   dur: 5.5 },
  { d: 'M44 100 Q41 80 43 62 Q45 44 41 26 Q38 8 42 -6',   delay: 1.4, dur: 7   },
  { d: 'M56 100 Q59 80 57 62 Q55 44 58 26 Q61 8 58 -6',   delay: 2.8, dur: 6   },
  { d: 'M38 100 Q35 78 38 58 Q40 38 36 20 Q33 4 37 -8',   delay: 0.7, dur: 7.5 },
  { d: 'M62 100 Q65 78 62 58 Q60 38 64 20 Q67 4 63 -8',   delay: 2.1, dur: 6.5 },
]

const PARTICLES = [
  { left: '10%', top: '22%', delay: 0,   dur: 12, size: 2   },
  { left: '84%', top: '16%', delay: 2.2, dur: 9,  size: 1.5 },
  { left: '20%', top: '68%', delay: 1,   dur: 13, size: 1.5 },
  { left: '74%', top: '72%', delay: 3,   dur: 10, size: 2   },
  { left: '91%', top: '44%', delay: 0.8, dur: 11, size: 1   },
  { left: '5%',  top: '54%', delay: 1.8, dur: 9,  size: 1.5 },
  { left: '50%', top: '12%', delay: 3.5, dur: 14, size: 1   },
  { left: '63%', top: '84%', delay: 0.4, dur: 10, size: 1.5 },
]

export default function ContactHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[#100800]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,_rgba(198,161,110,0.13)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,_rgba(176,96,32,0.12)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_42%,_rgba(12,6,0,0.78)_100%)] pointer-events-none" />

      {/* Grain */}
      <div className="cta-grain absolute inset-0 opacity-[0.032] pointer-events-none" />

      {/* Horizon lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/28 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/18 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-[#C8A36A]/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#C8A36A]/30 pointer-events-none" />

      {/* Smoke wisps */}
      {WISPS.map((w, i) => (
        <motion.svg key={i} viewBox="0 0 100 100" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-[70%] pointer-events-none" aria-hidden="true">
          <motion.path d={w.d} stroke="#C8A36A" strokeWidth="0.15" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.22, 0.12, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full bg-[#C8A36A] pointer-events-none"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -14, 0], opacity: [0.10, 0.42, 0.10] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Content */}
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
          className="font-display font-bold text-ivory leading-[1.08] tracking-tight mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
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
          className="font-serif italic text-ivory/50 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.4, 0, 0.2, 1] }}>
          Visit our atelier, speak with fragrance specialists,<br className="hidden sm:block" />
          and discover scents crafted around your identity.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}>
          <span className="text-[#C8A36A]/25 text-[8px] font-sans uppercase tracking-[0.25em]">Scroll</span>
          <motion.div className="w-px h-8 bg-gradient-to-b from-[#C8A36A]/35 to-transparent"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
