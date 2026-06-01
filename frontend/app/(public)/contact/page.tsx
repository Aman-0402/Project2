import type { Metadata } from 'next'
import ContactHero from './ContactHero'
import ContactCards from './ContactCards'
import ContactConsultation from './ContactConsultation'
import ContactLocation from './ContactLocation'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Visit M.M Attarwala in Vadodara. Private fragrance consultations, bespoke orders, WhatsApp inquiries, and atelier experiences.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <ContactCards />
      <ContactConsultation />
      <ContactLocation />
    </div>
  )
}
