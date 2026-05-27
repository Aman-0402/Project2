import { CONFIG } from '@/constants/config'

export function buildWhatsAppUrl(message?: string): string {
  const number = CONFIG.whatsappNumber.replace(/\D/g, '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

export function buildProductInquiryUrl(productName: string): string {
  const message = `Hello, I am interested in ${productName}.`
  return buildWhatsAppUrl(message)
}

export function buildProductBuyUrl(productName: string, price: string): string {
  const message = `Hello, I would like to purchase ${productName} (${price}). Please guide me with the order.`
  return buildWhatsAppUrl(message)
}

export function buildCustomFragranceUrl(): string {
  const message = `Hello, I am interested in a custom fragrance consultation with ${CONFIG.brandName}.`
  return buildWhatsAppUrl(message)
}
