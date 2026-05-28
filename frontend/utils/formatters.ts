export function formatPrice(price: string | number, currency: 'INR' | 'USD' = 'INR'): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(num)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}
