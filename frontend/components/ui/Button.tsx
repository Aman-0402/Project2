'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: [
    'bg-gold text-brown border border-gold',
    'hover:bg-gold-light hover:border-gold-light hover:-translate-y-0.5',
    'shadow-[0_2px_20px_rgba(198,161,110,0.15)]',
    'hover:shadow-[0_4px_32px_rgba(198,161,110,0.45)]',
  ].join(' '),
  secondary: [
    'bg-transparent text-brown border border-brown/50',
    'hover:bg-brown hover:text-ivory hover:border-brown hover:-translate-y-0.5',
    'hover:shadow-[0_4px_24px_rgba(59,36,25,0.25)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-gold border border-transparent',
    'hover:border-gold/40 hover:text-gold-light hover:-translate-y-0.5',
  ].join(' '),
  danger: [
    'bg-red-700 text-white border border-red-700',
    'hover:bg-red-800 hover:border-red-800 hover:-translate-y-0.5',
  ].join(' '),
  glass: [
    'bg-white/5 text-ivory border border-ivory/20 backdrop-blur-[10px]',
    'hover:bg-white/10 hover:border-gold/50 hover:text-gold hover:-translate-y-0.5',
    'hover:shadow-[0_4px_24px_rgba(198,161,110,0.2)]',
  ].join(' '),
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-xs tracking-luxury',
  md: 'px-8 py-3.5 text-xs tracking-luxury',
  lg: 'px-10 py-4 text-xs tracking-luxury',
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
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`
        relative inline-flex items-center justify-center gap-2.5
        font-sans uppercase transition-all duration-400
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
