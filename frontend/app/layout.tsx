import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Poppins } from 'next/font/google'
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

export const metadata: Metadata = {
  title: {
    default: 'LUXE PARFUM — The Art of Scent',
    template: '%s | LUXE PARFUM',
  },
  description:
    'LUXE PARFUM is a boutique luxury fragrance house crafting extraordinary scents. Discover our exclusive collection of Oud, Floral, Oriental, and rare perfumes.',
  keywords: ['luxury perfume', 'boutique fragrance', 'oud perfume', 'luxury scent', 'parfum'],
  openGraph: {
    type: 'website',
    siteName: 'LUXE PARFUM',
    title: 'LUXE PARFUM — The Art of Scent',
    description: 'Discover extraordinary luxury fragrances crafted for the discerning few.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${poppins.variable}`}>
      <body className="bg-ivory text-brown font-sans antialiased">
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  )
}
