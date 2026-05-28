'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function LuxuryCursor() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  const dotX = useMotionValue(-200)
  const dotY = useMotionValue(-200)

  const ringX = useSpring(dotX, { stiffness: 100, damping: 20, mass: 0.6 })
  const ringY = useSpring(dotY, { stiffness: 100, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')) {
        setHovered(true)
      }
    }
    const onOut = (e: MouseEvent) => {
      const el = e.relatedTarget as HTMLElement | null
      if (!el?.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseout', onOut, true)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseout', onOut, true)
    }
  }, [dotX, dotY, visible])

  if (!visible) return null

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-gold/40"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovered ? 48 : 30,
          height: hovered ? 48 : 30,
          borderColor: hovered ? 'rgba(198,161,110,0.9)' : 'rgba(198,161,110,0.4)',
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Precise dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-gold"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hovered ? 0 : 1, opacity: hovered ? 0 : 0.9 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
