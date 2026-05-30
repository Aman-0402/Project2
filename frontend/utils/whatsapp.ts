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
export function buildProductBuyUrl(
  productName: string,
  price: string,
  options?: {
    volume?: string
    description?: string
    fragranceNotes?: { top?: string[]; middle?: string[]; base?: string[] }
  }
): string {
  const lines: string[] = [
    `*ORDER REQUEST — ${CONFIG.brandName}*`,
    `--------------------------------`,
    ``,
    `*Fragrance:* ${productName}`,
  ]

  if (options?.volume) lines.push(`*Size:* ${options.volume}`)
  lines.push(`*Price:* ${price}`)

  if (options?.description) {
    lines.push(``, `*About this fragrance:*`, `_${options.description}_`)
  }

  const notes = options?.fragranceNotes
  if (notes && (notes.top?.length || notes.middle?.length || notes.base?.length)) {
    lines.push(``, `*Fragrance Notes:*`)
    if (notes.top?.length)    lines.push(`  Top Notes: ${notes.top.join(', ')}`)
    if (notes.middle?.length) lines.push(`  Heart Notes: ${notes.middle.join(', ')}`)
    if (notes.base?.length)   lines.push(`  Base Notes: ${notes.base.join(', ')}`)
  }

  lines.push(``, `--------------------------------`, `Please confirm availability and guide me with the order.`)

  return buildWhatsAppUrl(lines.join('\n'))
}

// Ask Details → M. Munavvar (secondary)
export function buildProductInquiryUrl(
  productName: string,
  options?: { volume?: string; description?: string }
): string {
  const lines: string[] = [
    `*FRAGRANCE INQUIRY — ${CONFIG.brandName}*`,
    `--------------------------------`,
    ``,
    `I am interested in: *${productName}*`,
  ]
  if (options?.volume)      lines.push(`Size: ${options.volume}`)
  if (options?.description) lines.push(``, `_${options.description}_`)
  lines.push(``, `Could you please share details on availability, price, and delivery?`)

  return buildWhatsAppUrl2(lines.join('\n'))
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
