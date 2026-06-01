'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

const PARTICLES = [
  { left: '8%',  top: '18%', delay: 0,   dur: 12, size: 2   },
  { left: '85%', top: '14%', delay: 2.2, dur: 9,  size: 1.5 },
  { left: '18%', top: '72%', delay: 1,   dur: 13, size: 1.5 },
  { left: '76%', top: '70%', delay: 3,   dur: 10, size: 2   },
  { left: '92%', top: '44%', delay: 0.8, dur: 11, size: 1   },
  { left: '4%',  top: '55%', delay: 1.8, dur: 9,  size: 1.5 },
  { left: '50%', top: '10%', delay: 3.5, dur: 14, size: 1   },
  { left: '60%', top: '86%', delay: 0.4, dur: 10, size: 1.5 },
  { left: '35%', top: '20%', delay: 2.8, dur: 11, size: 1   },
]

const WISPS = [
  { d: 'M50 100 Q48 80 51 60 Q53 40 50 18',  delay: 0,   dur: 5.5 },
  { d: 'M44 100 Q42 78 44 58 Q46 38 42 16',  delay: 1.4, dur: 7   },
  { d: 'M56 100 Q58 78 56 58 Q54 38 57 16',  delay: 2.8, dur: 6   },
]

// Magnetic button wrapper — gentle pull toward mouse
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
      <div className="absolute inset-0 bg-[#0C0600]" />

      {/* Primary radial spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,_rgba(198,161,110,0.14)_0%,_transparent_70%)]" />

      {/* Secondary warm bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_100%,_rgba(160,80,20,0.12)_0%,_transparent_60%)]" />

      {/* Vignette edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_40%,_rgba(8,4,0,0.80)_100%)] pointer-events-none" />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.032] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Top + bottom horizon lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A36A]/18 to-transparent" />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 w-9 h-9 border-t border-l border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute top-6 right-6 w-9 h-9 border-t border-r border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-9 h-9 border-b border-l border-[#C8A36A]/28 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-9 h-9 border-b border-r border-[#C8A36A]/28 pointer-events-none" />

      {/* Background bottle silhouette */}
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
          className="absolute bottom-0 left-0 right-0 w-full h-[60%] pointer-events-none" aria-hidden="true">
          <motion.path d={w.d} stroke="#C8A36A" strokeWidth="0.15" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.20, 0.10, 0] }}
            transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      ))}

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full bg-[#C8A36A] pointer-events-none"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -16, 0], opacity: [0.10, 0.42, 0.10] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 container-luxury max-w-2xl mx-auto px-6">

        {/* Eyebrow */}
        <motion.div className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="h-px w-10 bg-[#C8A36A]/35" />
          <p className="text-[#C8A36A] text-[10px] font-sans uppercase tracking-[0.32em]">Experience It</p>
          <div className="h-px w-10 bg-[#C8A36A]/35" />
        </motion.div>

        {/* Main heading */}
        <motion.h2 className="font-display font-bold text-ivory leading-[1.08] mb-3"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}>
          Discover A Scent
        </motion.h2>
        <motion.h2 className="font-serif font-light italic text-gradient-gold leading-[1.12] mb-8"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.28 }}>
          That Becomes Your Signature
        </motion.h2>

        {/* Gold ornament divider */}
        <motion.div className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C8A36A]/60" />
          <span className="text-[#C8A36A]/50 text-[10px]">◆</span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C8A36A]/60" />
        </motion.div>

        {/* Body */}
        <motion.p className="font-sans text-sm text-ivory/38 mb-12 leading-relaxed max-w-md mx-auto"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
          Explore our collection or speak with us on WhatsApp for a personal fragrance consultation.
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.65 }}>

          {/* Primary — gold shimmer */}
          <MagneticBtn>
            <Link href={ROUTES.collections} className="btn-luxury block px-12 py-4 text-center min-w-[200px]">
              Explore Collections
            </Link>
          </MagneticBtn>

          {/* Secondary — animated border + dark glass */}
          <MagneticBtn>
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="about-cta-outline block px-12 py-4 text-center min-w-[200px] text-[10px] font-sans uppercase tracking-luxury text-ivory/70 hover:text-[#C8A36A] transition-colors duration-400">
              WhatsApp Us
            </a>
          </MagneticBtn>

        </motion.div>
      </div>
    </section>
  )
}
