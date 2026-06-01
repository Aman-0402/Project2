'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CONFIG, ROUTES } from '@/constants/config'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import SocialCard from '@/components/ui/SocialCard'

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



interface FooterProps {
  instagramUrl?: string
  facebookUrl?:  string
  youtubeUrl?:   string
}

export default function Footer({ instagramUrl, facebookUrl, youtubeUrl }: FooterProps) {
  const year = new Date().getFullYear()
  const igUrl = instagramUrl || CONFIG.instagram
  const fbUrl = facebookUrl  || CONFIG.facebook
  const ytUrl = youtubeUrl   || CONFIG.youtube

  return (
    <footer className="relative bg-[#0C0700] overflow-hidden">

      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,_rgba(198,161,110,0.05)_0%,_transparent_65%)] pointer-events-none" />


      {/* ── Luxury quote divider ──────────────────────────────────────── */}
      <div className="relative border-b border-gold/10 py-10">
        <div className="container-luxury text-center">
          <div className="flex items-center gap-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <p className="font-serif text-ivory/60 italic text-sm md:text-base leading-relaxed max-w-xl">
              &ldquo;A fragrance is not merely a scent — it is an invisible signature, a memory before it happens.&rdquo;
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </div>
      </div>

      {/* ── Corner ornaments ──────────────────────────────────────────── */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/18" aria-hidden="true" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/18" aria-hidden="true" />

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="container-luxury pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-ivory/[0.06]">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt={CONFIG.brandName} width={40} height={40} className="object-contain w-10 h-10 flex-shrink-0" />
              <div>
                <p className="font-serif text-ivory text-xl tracking-[0.12em] leading-none">{CONFIG.brandName}</p>
                <p className="font-sans text-[9px] text-gold/55 uppercase tracking-luxury mt-1">{CONFIG.brandTagline}</p>
              </div>
            </div>

            <p className="font-sans text-ivory/30 mb-6 max-w-[260px] ft-input">
              Boutique fragrance house dedicated to the art of extraordinary scent. Vadodara, Gujarat, India.
            </p>

            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-gold/60 hover:text-gold transition-colors duration-300 border-b border-gold/18 hover:border-gold/50 pb-px ft-link-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WHATSAPP US
            </a>
          </div>

          {/* Collections */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Collections</h4>
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="group flex items-center gap-2 text-ivory/35 hover:text-gold/85 transition-colors duration-300 ft-nav-link">
                    <span className="w-3 h-px bg-gold/20 group-hover:w-5 group-hover:bg-gold/50 transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Services</h4>
            <ul className="flex flex-col gap-4">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="group flex items-center gap-2 text-ivory/35 hover:text-gold/85 transition-colors duration-300 ft-nav-link">
                    <span className="w-3 h-px bg-gold/20 group-hover:w-5 group-hover:bg-gold/50 transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin + Social */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Manage</h4>
            <p className="text-ivory/28 mb-5 ft-body">
              Admin access for store management and product updates.
            </p>

            <Link href="/admin"
              className="inline-flex items-center gap-2 border border-ivory/12 text-ivory/35 hover:border-gold/45 hover:text-gold font-sans uppercase px-4 py-2.5 transition-all duration-300 hover:-translate-y-px whitespace-nowrap ft-link-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Admin Login
            </Link>

            <div className="mt-6">
              <SocialCard instagramUrl={igUrl} facebookUrl={fbUrl} youtubeUrl={ytUrl} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ivory/18 ft-copy">
            &copy; {year} {CONFIG.brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-5 h-px bg-gold/22" />
            <span className="text-gold/35 uppercase ft-tagline">
              The Art of Scent
            </span>
            <span className="w-5 h-px bg-gold/22" />
          </div>
        </div>
      </div>

      {/* Bottom corner ornaments */}
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/18" aria-hidden="true" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/18" aria-hidden="true" />
    </footer>
  )
}
