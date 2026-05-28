'use client'

import { useCurrency } from '@/hooks/useCurrency'
import { formatPrice } from '@/utils/formatters'

interface CurrencyPriceProps {
  price: string | number
  className?: string
}

export default function CurrencyPrice({ price, className }: CurrencyPriceProps) {
  const currency = useCurrency()
  return (
    <span className={className}>
      {formatPrice(price, currency)}
    </span>
  )
}
