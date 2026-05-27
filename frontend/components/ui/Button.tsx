'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gold text-ivory border border-gold hover:bg-gold-dark hover:border-gold-dark',
  secondary: 'bg-transparent text-brown border border-brown hover:bg-brown hover:text-ivory',
  ghost: 'bg-transparent text-gold border border-transparent hover:border-gold/40',
  danger: 'bg-red-700 text-white border border-red-700 hover:bg-red-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs tracking-luxury',
  md: 'px-6 py-3 text-sm tracking-luxury',
  lg: 'px-10 py-4 text-sm tracking-wide-luxury',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-sans uppercase transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
