'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG, ROUTES } from '@/constants/config'

const NAV_LINKS = [
  { label: 'Collections',      href: ROUTES.collections     },
  { label: 'Create Fragrance', href: ROUTES.createFragrance },
  { label: 'About',            href: ROUTES.about           },
  { label: 'Contact',          href: ROUTES.contact         },
]

// Pages with dark backgrounds — keep light text + use dark glass when scrolled
const DARK_BG_PAGES = [ROUTES.createFragrance]

export default function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  const isHomepage    = pathname === '/'
  const isDarkBgPage  = DARK_BG_PAGES.includes(pathname)
  const isDarkBg      = isHomepage || isDarkBgPage
  const showGlass     = isScrolled || !isDarkBg

  // Light text when: on dark-bg page always, OR on homepage before scroll
  const isLightText   = isDarkBgPage || (isHomepage && !isScrolled)

  const headerClass = showGlass
    ? isDarkBgPage
      ? 'navbar-glass-dark border-b border-[#C8A36A]/15'
      : 'navbar-glass border-b border-[#C8A36A]/20'
    : 'bg-transparent'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${headerClass}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-18 md:h-20">

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link href={ROUTES.home} className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={CONFIG.brandName}
                width={40}
                height={40}
                className="object-contain w-9 h-9 md:w-10 md:h-10 flex-shrink-0"
              />
              <div className="flex flex-col items-start gap-[3px]">
                <span className={`font-serif font-medium text-xl md:text-2xl tracking-[0.10em] leading-none ${
                  isLightText ? 'text-ivory' : 'text-brown'
                }`}>
                  {CONFIG.brandName}
                </span>
                <span className={`font-sans font-bold text-[7.5px] tracking-[0.35em] uppercase ${
                  isLightText ? 'text-[#C8A36A]' : 'text-gold/90'
                }`}>
                  {CONFIG.brandTagline}
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} className="relative group py-2">

                    {/* Active indicator dot — slides between links via layoutId */}
                    {active && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Underline — grows from center on hover; solid on active */}
                    <span className={`absolute bottom-0 left-0 right-0 h-px origin-center transition-transform duration-500 ease-out ${
                      active
                        ? 'scale-x-100 bg-gold'
                        : 'scale-x-0 group-hover:scale-x-75 bg-gold/45'
                    }`} />

                    {/* Label */}
                    <motion.span
                      className={`block text-[11px] font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                        active
                          ? 'text-gold'
                          : isLightText
                          ? 'text-ivory/82 group-hover:text-ivory'
                          : 'text-brown/80 group-hover:text-brown'
                      }`}
                      whileHover={{ y: -1.5 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                )
              })}
            </nav>

            {/* ── Mobile Hamburger ─────────────────────────────────────── */}
            <button
              type="button"
              className="md:hidden flex flex-col justify-center gap-[5px] p-2 cursor-pointer"
              onClick={() => setIsMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <motion.span
                className={`block h-px origin-left rounded-full transition-colors duration-500 ${isLightText ? 'bg-ivory/75' : 'bg-brown'}`}
                animate={isMobileOpen ? { rotate: 45, y: 6, width: 22 } : { rotate: 0, y: 0, width: 22 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.span
                className={`block h-px rounded-full transition-colors duration-500 ${isLightText ? 'bg-ivory/75' : 'bg-brown'}`}
                animate={isMobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1, width: 14 }}
                transition={{ duration: 0.22 }}
              />
              <motion.span
                className={`block h-px origin-left rounded-full transition-colors duration-500 ${isLightText ? 'bg-ivory/75' : 'bg-brown'}`}
                animate={isMobileOpen ? { rotate: -45, y: -6, width: 22 } : { rotate: 0, y: 0, width: 22 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#120900] md:hidden flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between h-18 px-6 border-b border-[#C8A36A]/10">
              <span className="font-serif font-light text-ivory/75 text-lg tracking-[0.12em]">
                {CONFIG.brandName}
              </span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="text-ivory/25 hover:text-ivory/65 transition-colors p-2"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-0">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.08, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Link href={link.href}
                    className={`group relative block py-5 px-10 text-center font-serif font-light text-4xl tracking-[0.06em] transition-colors duration-300 ${
                      pathname === link.href ? 'text-[#C8A36A]' : 'text-ivory/38 hover:text-ivory/85'
                    }`}
                  >
                    {link.label}
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 h-px bg-[#C8A36A]/35 w-0 group-hover:w-1/3 transition-all duration-500 ease-out" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center pb-12 gap-4">
              <div className="h-px w-10 bg-[#C8A36A]/12" />
              <span className="text-[#C8A36A]/25 text-[8px] font-sans font-light uppercase tracking-[0.32em]">
                {CONFIG.brandTagline}
              </span>
              <div className="h-px w-10 bg-[#C8A36A]/12" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
