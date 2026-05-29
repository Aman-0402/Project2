import { CONFIG } from '@/constants/config'

export function buildWhatsAppUrl(message?: string): string {
  const number = CONFIG.whatsappNumber.replace(/\D/g, '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// Secondary number (M. Munavvar) — used for Ask Details
export function buildWhatsAppUrl2(message?: string): string {
  const number = CONFIG.whatsappNumber2.replace(/\D/g, '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// Buy Now → M. Roeesh (primary)
export function buildProductBuyUrl(productName: string, price: string): string {
  const message = `Hello, I would like to purchase ${productName} (${price}). Please guide me with the order.`
  return buildWhatsAppUrl(message)
}

// Ask Details → M. Munavvar (secondary)
export function buildProductInquiryUrl(productName: string): string {
  const message = `Hello, I am interested in ${productName}. Could you please share more details?`
  return buildWhatsAppUrl2(message)
}

export function buildCustomFragranceUrl(): string {
  const message = `Hello, I am interested in a custom fragrance consultation with ${CONFIG.brandName}.`
  return buildWhatsAppUrl(message)
}

export function buildCustomFragranceOrderUrl(profile: {
  family: string
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  intensityLabel: string
  fragranceName: string
  customerName: string
  customerPhone: string
  customerEmail: string
  additionalNotes: string
}): string {
  const noteLines: string[] = [
    profile.topNotes.length    ? `   Top: ${profile.topNotes.join(', ')}`    : '',
    profile.middleNotes.length ? `   Middle: ${profile.middleNotes.join(', ')}` : '',
    profile.baseNotes.length   ? `   Base: ${profile.baseNotes.join(', ')}`  : '',
  ].filter(Boolean)

  const lines: string[] = [
    `✨ *Custom Fragrance Request — ${CONFIG.brandName}*`,
    ``,
    `👤 *Customer Details*`,
    `Name: ${profile.customerName || '—'}`,
    `Phone: ${profile.customerPhone || '—'}`,
    ...(profile.customerEmail ? [`Email: ${profile.customerEmail}`] : []),
    ``,
    `🌹 *Fragrance Profile*`,
    `• Family: ${profile.family}`,
    `• Intensity: ${profile.intensityLabel}`,
    `• Name: "${profile.fragranceName || 'To be named'}"`,
    ...(noteLines.length ? [`• Notes:`, ...noteLines] : []),
    ``,
    ...(profile.additionalNotes ? [`📝 *Notes*`, profile.additionalNotes, ``] : [``]),
    `I am excited to create my signature scent with ${CONFIG.brandName}!`,
  ]
  return buildWhatsAppUrl(lines.join('\n'))
}
