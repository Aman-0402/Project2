import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Poppins, Noto_Serif_Devanagari, Lavishly_Yours } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import WhatsAppButton from '@/components/whatsapp/WhatsAppButton'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

const lavishly = Lavishly_Yours({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lavishly',
  display: 'swap',
})

const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500'],
  variable: '--font-devanagari',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'M.M ATTARWALA — The Art of Scent',
    template: '%s | M.M ATTARWALA',
  },
  description:
    'M.M ATTARWALA — Traditional Indian attars, perfumes, sprays & agarbatti crafted with timeless artistry. Trusted fragrance house in Vadodara, Gujarat.',
  keywords: ['attar', 'Indian perfume', 'M.M ATTARWALA', 'Vadodara perfume', 'oud attar', 'agarbatti', 'traditional fragrance', 'luxury scent'],
  openGraph: {
    type: 'website',
    siteName: 'M.M ATTARWALA',
    title: 'M.M ATTARWALA — The Art of Scent',
    description: 'Discover extraordinary luxury fragrances crafted for the discerning few.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${poppins.variable} ${devanagari.variable} ${lavishly.variable}`}>
      <body className="bg-ivory text-brown font-sans antialiased">
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
