import type { Metadata } from 'next'
import { CONFIG } from '@/constants/config'
import { buildWhatsAppUrl, buildWhatsAppUrl2 } from '@/utils/whatsapp'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Reach M.M Attarwala in Vadodara. Two store locations, WhatsApp inquiries, and fragrance consultations.`,
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

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
          <p className="font-sans text-sm text-ivory/50 mt-4">
            GF 154/155, Nazarbaug Palace, Mandvi, Vadodara — 390017
          </p>
        </div>
      </div>

      {/* Contact persons */}
      <section className="section-padding">
        <div className="container-luxury max-w-4xl">
          <div className="text-center mb-12">
            <p className="label-luxury mb-3">Direct Contact</p>
            <h2 className="heading-luxury">Speak to Our Team</h2>
            <div className="gold-divider mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* M. Roeesh */}
            <div className="bg-ivory border border-beige-dark p-8 hover:border-gold/30 hover:shadow-lg transition-all duration-500">
              <div className="w-8 h-px bg-gold mb-5" />
              <p className="label-luxury mb-1">Buy &amp; Orders</p>
              <h3 className="font-serif text-2xl text-brown mb-1">M. Roeesh</h3>
              <p className="font-sans text-sm text-brown/50 mb-5">+91 97245 86101</p>
              <a
                href={buildWhatsAppUrl(`Hello, I would like to inquire about your fragrances.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-ivory px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-gold-dark transition-colors duration-300"
              >
                {WA_ICON}
                WhatsApp
              </a>
            </div>

            {/* M. Munavvar */}
            <div className="bg-ivory border border-beige-dark p-8 hover:border-gold/30 hover:shadow-lg transition-all duration-500">
              <div className="w-8 h-px bg-gold mb-5" />
              <p className="label-luxury mb-1">Details &amp; Consultations</p>
              <h3 className="font-serif text-2xl text-brown mb-1">M. Munavvar</h3>
              <p className="font-sans text-sm text-brown/50 mb-5">+91 90163 61538</p>
              <a
                href={buildWhatsAppUrl2(`Hello, I would like to learn more about your fragrances.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brown text-brown px-5 py-2.5 text-xs font-sans uppercase tracking-luxury hover:bg-brown hover:text-ivory transition-colors duration-300"
              >
                {WA_ICON}
                WhatsApp
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="border-t border-beige-dark pt-12 mb-12 text-center">
            <p className="label-luxury mb-3">Email</p>
            <a
              href={`mailto:${CONFIG.email}`}
              className="font-serif text-2xl text-brown hover:text-gold transition-colors duration-300"
            >
              {CONFIG.email}
            </a>
          </div>

          {/* Store addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-ivory border border-beige-dark p-8">
              <div className="w-8 h-px bg-gold mb-5" />
              <p className="label-luxury mb-3">Head Store</p>
              <address className="not-italic font-sans text-sm text-brown/70 leading-relaxed">
                GF 154/155, Nazarbaug Palace<br />
                Opp. Jamnabai Hospital, Mandvi<br />
                Vadodara – 390017<br />
                Gujarat, India
              </address>
            </div>

            <div className="bg-ivory border border-beige-dark p-8">
              <div className="w-8 h-px bg-gold mb-5" />
              <p className="label-luxury mb-3">Branch Store</p>
              <address className="not-italic font-sans text-sm text-brown/70 leading-relaxed">
                Shop No. 3, Fortune Point<br />
                Opp. Jumma Masjid, Mandvi<br />
                Vadodara – 390017<br />
                Gujarat, India
              </address>
            </div>
          </div>

          {/* Shop timings */}
          <div className="bg-brown/5 border border-beige-dark p-8">
            <div className="w-8 h-px bg-gold mb-5" />
            <p className="label-luxury mb-4">Shop Timings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm text-brown/70">
              <div>
                <p className="text-brown font-medium mb-1">Open Daily</p>
                <p>10:00 AM – 8:00 PM</p>
              </div>
              <div>
                <p className="text-brown font-medium mb-1">Closed</p>
                <p>Monday — Full day</p>
                <p>Friday — 12:45 PM to 2:45 PM</p>
                <p className="text-brown/40 text-xs mt-1">Also closed during Namaz time</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
