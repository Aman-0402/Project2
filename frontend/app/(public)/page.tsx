import type { Metadata } from 'next'
import HeroSection from '@/sections/HeroSection'
import FeaturedPerfumes from '@/sections/FeaturedPerfumes'
import BrandStory from '@/sections/BrandStory'
import CustomFragranceCTA from '@/sections/CustomFragranceCTA'
import ProductShowcase from '@/sections/ProductShowcase'
import Testimonials from '@/sections/Testimonials'
import WhatsAppCTASection from '@/sections/WhatsAppCTASection'

export const metadata: Metadata = {
  title: 'LUXE PARFUM — The Art of Scent',
  description: 'Discover extraordinary luxury fragrances. Oud, Floral, Oriental, and rare perfumes crafted for the discerning few.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPerfumes />
      <BrandStory />
      <CustomFragranceCTA />
      <ProductShowcase />
      <Testimonials />
      <WhatsAppCTASection />
    </>
  )
}
