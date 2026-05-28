'use client'

import { useState, useEffect } from 'react'

export type Currency = 'INR' | 'USD'

function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz === 'Asia/Kolkata' ? 'INR' : 'USD'
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
