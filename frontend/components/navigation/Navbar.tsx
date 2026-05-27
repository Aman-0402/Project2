'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG, ROUTES } from '@/constants/config'

const NAV_LINKS = [
  { label: 'Collections', href: ROUTES.collections },
  { label: 'About', href: ROUTES.about },
  { label: 'Contact', href: ROUTES.contact },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  const isHomepage = pathname === '/'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled || !isHomepage
            ? 'glass border-b border-beige-dark shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo */}
            <Link href={ROUTES.home} className="group flex flex-col items-start">
              <span className="font-serif text-xl md:text-2xl text-brown tracking-wide leading-none">
                {CONFIG.brandName}
              </span>
              <span className="label-luxury text-[9px] tracking-wide-luxury opacity-60 group-hover:opacity-100 transition-opacity">
                {CONFIG.brandTagline}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    label-luxury text-[11px] transition-colors duration-300 relative group
                    ${pathname === link.href ? 'text-gold' : 'text-brown hover:text-gold'}
                  `}
                >
                  {link.label}
                  <span className={`
                    absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300
                    ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}
                  `} />
                </Link>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-px bg-brown origin-center"
                animate={isMobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-px bg-brown"
                animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-6 h-px bg-brown origin-center"
                animate={isMobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 pt-20 bg-ivory md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="flex flex-col items-center justify-center h-full gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-3xl text-brown hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
