import type { Metadata } from 'next'
import { CONFIG } from '@/constants/config'
import { buildWhatsAppUrl, buildCustomFragranceUrl } from '@/utils/whatsapp'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${CONFIG.brandName}. Fragrance inquiries, bespoke commissions, and consultations via WhatsApp.`,
}

const CONTACT_OPTIONS = [
  {
    title: 'Product Inquiry',
    description: 'Questions about a specific fragrance — notes, longevity, occasions.',
    action: buildWhatsAppUrl(`Hello, I have a question about one of your fragrances.`),
    label: 'Ask on WhatsApp',
  },
  {
    title: 'Place an Order',
    description: 'Ready to purchase? Connect with us and we will guide you through.',
    action: buildWhatsAppUrl(`Hello, I would like to place an order with ${CONFIG.brandName}.`),
    label: 'Order via WhatsApp',
  },
  {
    title: 'Bespoke Consultation',
    description: 'Commission a completely unique fragrance crafted around your story.',
    action: buildCustomFragranceUrl(),
    label: 'Start Consultation',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-brown py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <div className="container-luxury text-center relative">
          <p className="label-luxury text-gold mb-4">Reach Us</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide">Contact</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>
      </div>

      {/* Contact options */}
      <section className="section-padding">
        <div className="container-luxury max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="label-luxury mb-3">How Can We Help</p>
            <h2 className="heading-luxury">Get in Touch</h2>
            <div className="gold-divider mx-auto" />
            <p className="font-sans text-sm text-brown/60 mt-6 max-w-md mx-auto">
              We are available via WhatsApp for all inquiries. Select the option that best describes your need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_OPTIONS.map((option) => (
              <div
                key={option.title}
                className="bg-ivory border border-beige-dark p-8 hover:border-gold/30 hover:shadow-lg transition-all duration-500 flex flex-col"
              >
                <div className="w-8 h-px bg-gold mb-6" />
                <h3 className="font-serif text-xl text-brown mb-3">{option.title}</h3>
                <p className="font-sans text-sm text-brown/60 leading-relaxed flex-1 mb-6">
                  {option.description}
                </p>
                <a
                  href={option.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold border-b border-gold/30 pb-1 text-xs font-sans uppercase tracking-luxury hover:border-gold transition-colors duration-300 self-start"
                >
                  {option.label}
                  <span className="text-xs">&rarr;</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General WhatsApp CTA */}
      <section className="py-16 bg-beige">
        <div className="container-luxury text-center">
          <p className="label-luxury mb-4">Direct Line</p>
          <h2 className="font-serif text-3xl text-brown mb-4">Prefer to Just Message Us?</h2>
          <p className="font-sans text-sm text-brown/60 mb-8 max-w-sm mx-auto">
            Open WhatsApp and say hello. We will take care of the rest.
          </p>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 text-xs font-sans uppercase tracking-luxury hover:bg-[#1ebe5a] transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Open WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
