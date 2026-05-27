import type { Metadata } from 'next'
import { CONFIG } from '@/constants/config'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${CONFIG.apiUrl}/products/${params.slug}/`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const { data } = await res.json()
      if (data) {
        return {
          title: data.name,
          description: data.description ?? `Discover ${data.name} — a luxury fragrance by ${CONFIG.brandName}.`,
          openGraph: {
            title: `${data.name} | ${CONFIG.brandName}`,
            description: data.description ?? `A luxury fragrance by ${CONFIG.brandName}.`,
            images: data.image ? [{ url: data.image, alt: data.name }] : [],
          },
        }
      }
    }
  } catch {
    // fall through to defaults
  }
  return {
    title: 'Fragrance',
    description: `Luxury fragrance by ${CONFIG.brandName}.`,
  }
}

export default function ProductDetailPage() {
  return <ProductDetailClient />
}
