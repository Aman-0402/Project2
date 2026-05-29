'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { CONFIG, ROUTES } from '@/constants/config'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.adminDashboard,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: ROUTES.adminProducts,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.399 2.798H4.198c-1.429 0-2.4-1.798-1.4-2.798L4 14.5" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: ROUTES.adminCategories,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    label: 'Inquiries',
    href: ROUTES.adminInquiries,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-60 h-full bg-brown flex flex-col border-r border-ivory/5 overflow-y-auto">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-ivory/10">
        <p className="font-serif text-ivory text-lg tracking-wide">{CONFIG.brandName}</p>
        <p className="text-gold text-xs font-sans uppercase tracking-luxury mt-0.5">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === ROUTES.adminDashboard
              ? pathname === ROUTES.adminDashboard
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 text-sm font-sans
                transition-all duration-200 group
                ${isActive
                  ? 'text-ivory'
                  : 'text-ivory/50 hover:text-ivory hover:bg-ivory/5'
                }
              `}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-indicator"
                  className="absolute inset-0 rounded-sm"
                  style={{ background: 'linear-gradient(90deg, rgba(198,161,110,0.22), transparent)' }}
                />
              )}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold rounded-r-sm" />
              )}
              <span className={isActive ? 'text-gold' : 'text-ivory/40 group-hover:text-ivory/70'}>
                {item.icon}
              </span>
              <span className="tracking-wide uppercase text-xs">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-5 border-t border-ivory/10">
        {user && (
          <p className="text-ivory/40 text-xs font-sans mb-3 truncate">
            {user.username}
          </p>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-ivory/40 hover:text-red-400 text-xs font-sans uppercase tracking-luxury transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
