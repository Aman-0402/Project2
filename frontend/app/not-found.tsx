import Link from 'next/link'
import { ROUTES, CONFIG } from '@/constants/config'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brown flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      <div className="relative">
        <p className="font-serif text-[120px] md:text-[180px] leading-none text-ivory/5 select-none">
          404
        </p>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <p className="label-luxury text-gold">Page Not Found</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide">
            This Scent Has Faded
          </h1>
          <div className="w-12 h-px bg-gold" />
          <p className="font-sans text-sm text-ivory/40 max-w-xs">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-2 bg-gold text-ivory px-8 py-3 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
            >
              Go Home
            </Link>
            <Link
              href={ROUTES.collections}
              className="inline-flex items-center gap-2 bg-transparent text-ivory border border-ivory/20 px-8 py-3 text-xs font-sans uppercase tracking-luxury hover:border-gold hover:text-gold transition-all duration-300"
            >
              Collections
            </Link>
          </div>
          <p className="font-sans text-xs text-ivory/20 mt-4 tracking-luxury uppercase">
            {CONFIG.brandName}
          </p>
        </div>
      </div>
    </div>
  )
}
