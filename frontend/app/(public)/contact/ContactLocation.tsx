'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }

const CLOCK_ICON = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-7 h-7" aria-hidden="true">
    <circle cx="16" cy="16" r="12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 9v7l5 3" />
  </svg>
)

const PIN_ICON = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-6 h-6" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3C11 3 7 7 7 12c0 7 9 17 9 17s9-10 9-17c0-5-4-9-9-9z" />
    <circle cx="16" cy="12" r="3" />
  </svg>
)

const STORES = [
  {
    label: 'Head Store',
    image: '/images/shop.png',
    lines: ['GF 154/155, Nazarbaug Palace', 'Opp. Jamnabai Hospital, Mandvi', 'Vadodara – 390017', 'Gujarat, India'],
  },
  {
    label: 'Branch Store',
    image: '/images/shop.png',
    lines: ['Shop No. 3, Fortune Point', 'Opp. Jumma Masjid, Mandvi', 'Vadodara – 390017', 'Gujarat, India'],
  },
]

export default function ContactLocation() {
  return (
    <section className="section-padding bg-beige overflow-hidden">
      <div className="container-luxury max-w-4xl">

        {/* Heritage line */}
        <motion.div className="text-center mb-16"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <span className="font-sans text-[10px] text-gold uppercase tracking-[0.32em]">Since 1986</span>
            <span className="text-gold/40 text-[8px]">◆</span>
            <span className="font-sans text-[10px] text-gold/70 uppercase tracking-[0.32em]">Crafted in Vadodara</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <p className="label-luxury mb-3">Find Us</p>
          <h2 className="heading-luxury">Our Ateliers</h2>
          <div className="gold-divider mx-auto mt-4" />
          <p className="font-sans text-brown/50 text-sm mt-6 leading-relaxed max-w-sm mx-auto">
            Handcrafted fragrances from the heart of Gujarat,<br />in the lanes of Vadodara since 1986.
          </p>
        </motion.div>

        {/* Store cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {STORES.map((store, i) => (
            <motion.div key={store.label}
              className="contact-card group overflow-hidden"
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -4 }}>

              {/* Store image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brown-dark via-brown to-[#3B2419]">
                <Image
                  src={store.image}
                  alt={store.label}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-sans text-[9px] text-ivory/60 uppercase tracking-[0.28em]">{store.label}</span>
                </div>
              </div>

              <div className="p-7">
                <div className="flex items-start gap-3">
                  <div className="text-gold/50 mt-0.5 flex-shrink-0">{PIN_ICON}</div>
                  <address className="not-italic font-sans text-sm text-brown/65 leading-[1.9]">
                    {store.lines.map((line, j) => (
                      <span key={j}>{line}{j < store.lines.length - 1 && <br />}</span>
                    ))}
                  </address>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Map */}
        <motion.div
          className="contact-card overflow-hidden mb-14 p-0"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d843.5441072525884!2d73.21205917121986!3d22.30045387038203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcf5f95555555%3A0xf487b6bfba37ef2f!2sM.M.%20ATTARWALA!5e1!3m2!1sen!2sin!4v1780322712069!5m2!1sen!2sin"
              width="100%"
              height="380"
              className="border-0 block"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="M.M Attarwala Store Location"
            />
          </div>
        </motion.div>

        {/* Atelier Hours */}
        <motion.div
          className="contact-card relative overflow-hidden"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="p-8 md:p-10">

            <div className="flex items-center gap-3 mb-2">
              <div className="text-gold/60">{CLOCK_ICON}</div>
              <p className="label-luxury text-gold">Atelier Hours</p>
            </div>
            <p className="font-serif italic text-brown/60 text-sm mb-8 ml-10">
              Open daily for private fragrance consultations and bespoke scent experiences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="w-6 h-px bg-gold/40 mb-4" />
                <p className="font-display font-bold text-brown text-xl mb-1">Open Daily</p>
                <p className="font-serif italic text-gold text-2xl mb-1">10:00 AM – 8:00 PM</p>
                <p className="font-sans text-xs text-brown/40 uppercase tracking-luxury">Saturday to Thursday</p>
              </div>
              <div>
                <div className="w-6 h-px bg-gold/40 mb-4" />
                <p className="font-display font-bold text-brown text-xl mb-3">Closed</p>
                <div className="space-y-2 font-sans text-sm text-brown/60 leading-relaxed">
                  <p>Monday — Full day</p>
                  <p>Friday — 12:45 PM to 2:45 PM</p>
                  <p className="text-brown/35 text-xs mt-2 italic">Also closed during Namaz time</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
