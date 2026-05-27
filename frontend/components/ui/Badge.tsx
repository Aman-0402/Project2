import { ReactNode } from 'react'

type BadgeVariant = 'gold' | 'brown' | 'beige' | 'success' | 'danger'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold/10 text-gold border border-gold/30',
  brown: 'bg-brown/10 text-brown border border-brown/30',
  beige: 'bg-beige text-brown border border-beige-dark',
  success: 'bg-green-50 text-green-700 border border-green-200',
  danger: 'bg-red-50 text-red-600 border border-red-200',
}

export default function Badge({ children, variant = 'gold', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-3 py-0.5 text-xs font-sans uppercase tracking-luxury
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
