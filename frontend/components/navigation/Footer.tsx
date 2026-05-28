'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

const NAV_LINKS = [
  { label: 'Home',        href: ROUTES.home },
  { label: 'Collections', href: ROUTES.collections },
  { label: 'About',       href: ROUTES.about },
  { label: 'Contact',     href: ROUTES.contact },
]

const SERVICE_LINKS = [
  { label: 'Create Fragrance', href: ROUTES.createFragrance },
  { label: 'Bespoke Orders',   href: ROUTES.contact },
  { label: 'Gift Boxes',       href: ROUTES.collections },
  { label: 'Consultation',     href: ROUTES.contact },
]

function DiamondMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
      <polygon points="24,2 46,24 24,46 2,24" stroke="#C6A16E" strokeWidth="1" fill="none" strokeOpacity="0.7" />
      <polygon points="24,10 38,24 24,38 10,24" stroke="#C6A16E" strokeWidth="0.6" fill="none" strokeOpacity="0.4" />
      <circle cx="24" cy="24" r="4" fill="#C6A16E" fillOpacity="0.5" />
    </svg>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const year = new Date().getFullYear()

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <footer className="relative bg-[#0E0704] overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,_rgba(198,161,110,0.04)_0%,_transparent_70%)] pointer-events-none" />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-14 h-14 border-t border-l border-gold/20" aria-hidden="true" />
      <div className="absolute top-8 right-8 w-14 h-14 border-t border-r border-gold/20" aria-hidden="true" />

      <div className="container-luxury pt-20 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-ivory/8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <DiamondMark />
              <div>
                <p className="font-serif text-ivory text-xl tracking-[0.12em] leading-none">{CONFIG.brandName}</p>
                <p className="font-sans text-[9px] text-gold/60 uppercase tracking-luxury mt-1">{CONFIG.brandTagline}</p>
              </div>
            </div>

            <p className="font-serif text-ivory/40 text-sm italic leading-[1.8] max-w-[260px] mb-6">
              &ldquo;A fragrance is not merely a scent —<br />
              it is an invisible signature,<br />
              a memory before it happens.&rdquo;
            </p>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-xs text-gold/70 hover:text-gold transition-colors duration-300 border-b border-gold/20 hover:border-gold/50 pb-px"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Collections */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Collections</h4>
            <ul className="flex flex-col gap-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 font-sans text-sm text-ivory/40 hover:text-gold/90 transition-colors duration-300"
                  >
                    <span className="w-3 h-px bg-gold/20 group-hover:w-5 group-hover:bg-gold/50 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Services</h4>
            <ul className="flex flex-col gap-3.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 font-sans text-sm text-ivory/40 hover:text-gold/90 transition-colors duration-300"
                  >
                    <span className="w-3 h-px bg-gold/20 group-hover:w-5 group-hover:bg-gold/50 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Exclusive Access</h4>
            <p className="font-sans text-sm text-ivory/40 leading-relaxed mb-5">
              Join our inner circle for rare launches and private fragrance previews.
            </p>

            {submitted ? (
              <div className="border border-gold/30 px-4 py-3">
                <p className="font-sans text-xs text-gold/70 tracking-luxury uppercase">Welcomed to the circle</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="bg-transparent border border-ivory/15 px-4 py-2.5 font-sans text-xs text-ivory/70 placeholder-ivory/25 focus:outline-none focus:border-gold/50 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="border border-gold/40 text-gold/70 hover:border-gold hover:text-gold font-sans text-xs uppercase tracking-luxury px-4 py-2.5 transition-all duration-300 hover:-translate-y-px cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* Social placeholder */}
            <div className="mt-6 flex items-center gap-3">
              <span className="font-sans text-[10px] text-ivory/20 uppercase tracking-luxury">Follow</span>
              <span className="flex-1 h-px bg-ivory/8" />
              <div className="flex gap-2">
                {['IG', 'TT'].map((s) => (
                  <span key={s} className="w-7 h-7 border border-ivory/12 flex items-center justify-center font-sans text-[9px] text-ivory/25 hover:border-gold/30 hover:text-gold/50 transition-colors duration-300 cursor-pointer">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-ivory/20">
            &copy; {year} {CONFIG.brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-6 h-px bg-gold/25" />
            <span className="font-sans text-[10px] text-gold/40 tracking-luxury uppercase">
              The Art of Scent
            </span>
            <span className="w-6 h-px bg-gold/25" />
          </div>
        </div>
      </div>

      {/* Bottom corner ornaments */}
      <div className="absolute bottom-8 left-8 w-14 h-14 border-b border-l border-gold/20" aria-hidden="true" />
      <div className="absolute bottom-8 right-8 w-14 h-14 border-b border-r border-gold/20" aria-hidden="true" />
    </footer>
  )
}
