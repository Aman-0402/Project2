'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  rows?: number
}

const inputBase = `
  w-full bg-ivory border border-beige-dark px-4 py-3
  font-sans text-sm text-brown placeholder:text-brown/40
  focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label-luxury">{label}</label>
      )}
      <input
        ref={ref}
        className={`${inputBase} ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
      {hint && !error && <p className="text-brown/50 text-xs font-sans">{hint}</p>}
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, rows = 4, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label-luxury">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${inputBase} resize-none ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
      {hint && !error && <p className="text-brown/50 text-xs font-sans">{hint}</p>}
    </div>
  )
})
