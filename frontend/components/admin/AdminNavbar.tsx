'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/constants/config'

const BREADCRUMB_MAP: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'New Product',
  '/admin/categories': 'Categories',
  '/admin/inquiries': 'Fragrance Inquiries',
  '/admin/settings': 'Settings',
}

function getBreadcrumb(pathname: string): string {
  if (BREADCRUMB_MAP[pathname]) return BREADCRUMB_MAP[pathname]
  if (pathname.includes('/edit')) return 'Edit Product'
  return 'Admin'
}

interface AdminNavbarProps {
  onMenuToggle?: () => void
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const pathname = usePathname()
  const breadcrumb = getBreadcrumb(pathname)

  return (
    <header className="h-14 bg-ivory border-b border-beige-dark flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-1 text-brown/50 hover:text-brown transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="text-brown/40 text-xs font-sans uppercase tracking-luxury hidden sm:inline">Admin</span>
        <span className="text-brown/30 text-xs hidden sm:inline">/</span>
        <span className="text-brown text-xs font-sans uppercase tracking-luxury">{breadcrumb}</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.home}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brown/40 hover:text-gold text-xs font-sans uppercase tracking-luxury transition-colors duration-200 flex items-center gap-1.5"
        >
          View Site
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
