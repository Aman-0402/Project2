'use client'

import { useState, useEffect } from 'react'

export type Currency = 'INR' | 'USD'

function detectCurrency(): Currency {
  try {
    // India is UTC+5:30 — getTimezoneOffset() returns minutes BEHIND UTC (-330 for IST)
    return new Date().getTimezoneOffset() === -330 ? 'INR' : 'USD'
  } catch {
    return 'INR'
  }
}

export function useCurrency(): Currency {
  // Default INR — avoids SSR/hydration mismatch for Indian-primary audience
  const [currency, setCurrency] = useState<Currency>('INR')

  useEffect(() => {
    setCurrency(detectCurrency())
  }, [])

  return currency
}
