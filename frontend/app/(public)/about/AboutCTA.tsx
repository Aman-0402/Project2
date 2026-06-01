'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

const PARTICLES = [
  { left: '8%',  top: '18%', delay: 0,   dur: 12, size: 2,   glow: 0.6 },
  { left: '85%', top: '14%', delay: 2.2, dur: 9,  size: 1.5, glow: 0.4 },
  { left: '18%', top: '72%', delay: 1,   dur: 13, size: 1.5, glow: 0.5 },
  { left: '76%', top: '70%', delay: 3,   dur: 10, size: 2,   glow: 0.6 },
  { left: '92%', top: '44%', delay: 0.8, dur: 11, size: 1,   glow: 0.3 },
  { left: '4%',  top: '55%', delay: 1.8, dur: 9,  size: 1.5, glow: 0.5 },
  { left: '50%', top: '10%', delay: 3.5, dur: 14, size: 1,   glow: 0.3 },
  { left: '60%', top: '86%', delay: 0.4, dur: 10, size: 1.5, glow: 0.4 },
  { left: '35%', top: '20%', delay: 2.8, dur: 11, size: 1,   glow: 0.3 },
  { left: '25%', top: '45%', delay: 1.5, dur: 13, size: 2,   glow: 0.7 },
  { left: '70%', top: '35%', delay: 3.2, dur: 8,  size: 1.5, glow: 0.5 },
  { left: '42%', top: '78%', delay: 0.6, dur: 11, size: 1,   glow: 0.3 },
]

const WISPS = [
  { d: 'M50 100 Q48 80 51 60 Q53 40 50 18',  delay: 0,   dur: 5.5 },
  { d: 'M44 100 Q42 78 44 58 Q46 38 42 16',  delay: 1.4, dur: 7   },
  { d: 'M56 100 Q58 78 56 58 Q54 38 57 16',  delay: 2.8, dur: 6   },
  { d: 'M30 100 Q28 75 32 55 Q34 35 30 12',  delay: 0.7, dur: 8   },
  { d: 'M70 100 Q72 78 68 58 Q66 38 72 16',  delay: 2.0, dur: 6.5 },
]

function MagneticBtn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 280, damping: 18 })
  const sy = useSpring(my, { stiffness: 280, damping: 18 })

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width  / 2)) * 0.22)
    my.set((e.clientY - (r.top  + r.height / 2)) * 0.22)
  }
  function onLeave() { mx.set(0); my.set(0) }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </div>
  )
}

export default function AboutCTA() {
  return (
    <section className="relative py-36 overflow-hidden text-center">

      {/* ── Background ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#0A0500]" />

      {/* Rotating cinematic light beam */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(198,161,110,0.06) 30deg, transparent 60deg, transparent 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      {/* Primary radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_45%,_rgba(198,161,110,0.20)_0%,_transparent_70%)] pointer-events-none" />

      {/* Vertical light shaft from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2/3 bg-gradient-to-b from-[#C8A36A]/25 to-transparent pointer-events-none" />
      <div className="cta-light-shaft absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1/2 bg-gradient-to-b from-[#C8A36A]/05 to-transparent pointer-events-none" />

      {/* Warm bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_100%,_rgba(160,80,20,0.15)_0%,_transparent_60%)] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_35%,_rgba(6,3,0,0.88)_100%)] pointer-events-none" />

      {/* Grain */}
      <div className="cta-grain absolute inset-0 opacity-[0.032] pointer-events-none" />

      {/* Horizon lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/18 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 w-9 h-9 border-t border-l border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute top-6 right-6 w-9 h-9 border-t border-r border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-9 h-9 border-b border-l border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-9 h-9 border-b border-r border-[#C8A36A]/28 pointer-events-none" />

      {/* Bottle silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 120 212" fill="none" className="w-64 h-auto opacity-[0.04]" aria-hidden="true">
          <rect x="54" y="2" width="12" height="5" rx="3" fill="#C8A36A" />
          <rect x="58" y="2" width="4" height="10" rx="2" fill="#C8A36A" />
          <rect x="38" y="7" width="44" height="20" rx="6" fill="#C8A36A" />
          <rect x="49" y="27" width="22" height="22" rx="1" fill="#C8A36A" />
          <path d="M49 49 Q33 54 18 58 L102 58 Q87 54 71 49 Z" fill="#C8A36A" />
          <rect x="18" y="58" width="84" height="128" rx="10" fill="#C8A36A" />
        </svg>
      </div>

      {/* Smoke wisps */}
      {WISPS.map((w, i) => (
        <motion.svg key={i} viewBox="0 0 100 100" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full h-[65%] pointer-events-none" aria-hidden="true">
          <motion.path d={w.d} stroke="#C8A36A" strokeWidth="0.18" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.28, 0.14, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* Floating glow particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: '#C8A36A',
            boxShadow: `0 0 ${p.size * 5}px ${p.size * 2}px rgba(200,163,106,${p.glow})`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.12, 0.55, 0.12] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 container-luxury mx-auto px-6">
      <div className="cta-glass-panel px-8 py-14 md:px-16 md:py-20 max-w-3xl mx-auto">

        {/* Eyebrow */}
        <motion.div className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="h-px w-10 bg-[#C8A36A]/35" />
          <p className="text-[#C8A36A] text-[10px] font-sans uppercase tracking-[0.32em]">Experience It</p>
          <div className="h-px w-10 bg-[#C8A36A]/35" />
        </motion.div>

        {/* Heading lines */}
        <motion.h2
          className="cta-heading font-display font-bold text-ivory leading-[1.05] mb-2"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}>
          Discover A Scent
        </motion.h2>

        <motion.h2
          className="cta-heading font-display font-bold text-ivory leading-[1.05] mb-3"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.25 }}>
          That Becomes Your
        </motion.h2>

        {/* SIGNATURE — cinematic hero word */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}>
          <span className="cta-signature font-serif italic text-gradient-gold block leading-[0.88] mb-12 select-none">
            Signature
          </span>
        </motion.div>

        {/* Gold ornament divider */}
        <motion.div className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.55 }}>
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C8A36A]/60" />
          <span className="text-[#C8A36A]/50 text-[10px]">◆</span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C8A36A]/60" />
        </motion.div>

        {/* Body copy */}
        <motion.p className="font-sans text-sm text-ivory/40 mb-14 leading-relaxed max-w-md mx-auto"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.65 }}>
          Explore our collection or speak with us on WhatsApp for a personal fragrance consultation.
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.78 }}>

          {/* Primary — warm gold fill + glow */}
          <MagneticBtn>
            <Link href={ROUTES.collections}
              className="btn-cta-gold relative inline-flex items-center justify-center min-w-[220px] px-12 py-4 font-sans text-xs uppercase tracking-luxury font-semibold overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
              Explore Collections
            </Link>
          </MagneticBtn>

          {/* Secondary — glass outline, gold fill on hover */}
          <MagneticBtn>
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="btn-cta-glass group relative inline-flex items-center justify-center min-w-[220px] px-12 py-4 font-sans text-xs uppercase tracking-luxury overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
              <span className="btn-cta-glass-fill absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[380ms] ease-out" />
              <span className="relative z-10 transition-colors duration-200 group-hover:text-[#1a0e02]">WhatsApp Us</span>
            </a>
          </MagneticBtn>

        </motion.div>
      </div>
      </div>
    </section>
  )
}
