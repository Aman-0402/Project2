import Link from 'next/link'
import { CONFIG, ROUTES } from '@/constants/config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brown text-ivory/70">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-ivory/10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-ivory text-2xl tracking-wide mb-3">
              {CONFIG.brandName}
            </h3>
            <p className="label-luxury text-gold mb-4">{CONFIG.brandTagline}</p>
            <p className="font-sans text-sm text-ivory/50 leading-relaxed max-w-xs">
              A boutique fragrance house dedicated to crafting extraordinary scents
              that tell stories and define moments.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Navigate</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Home', href: ROUTES.home },
                { label: 'Collections', href: ROUTES.collections },
                { label: 'About', href: ROUTES.about },
                { label: 'Contact', href: ROUTES.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-ivory/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-luxury text-gold mb-6">Contact</h4>
            <p className="font-sans text-sm text-ivory/50 mb-4">
              Inquiries and bespoke fragrance consultations via WhatsApp.
            </p>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-light transition-colors duration-300"
            >
              <span>WhatsApp Us</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-ivory/30">
            &copy; {year} {CONFIG.brandName}. All rights reserved.
          </p>
          <div className="gold-divider md:hidden" />
          <div className="flex items-center gap-1">
            <span className="w-8 h-px bg-gold/40" />
            <span className="font-sans text-xs text-gold/60 px-3 tracking-luxury uppercase">
              {CONFIG.brandTagline}
            </span>
            <span className="w-8 h-px bg-gold/40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
