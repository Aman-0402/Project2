import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CONFIG } from '@/constants/config'
import type { Product } from '@/types'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: { slug: string }
}

// ISR: revalidate every 5 minutes — product content changes only when admin edits
export const revalidate = 300

export async function generateStaticParams() {
  try {
    const res = await fetch(`${CONFIG.apiUrl}/products/?page_size=100`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const body = await res.json()
    // Paginated response: { results: [...] }
    const products: Array<{ slug: string }> = body.results ?? []
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${CONFIG.apiUrl}/products/${slug}/`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const { data } = await res.json()
    return data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.slug)
  if (!product) {
    return {
      title: 'Fragrance',
      description: `Luxury fragrance by ${CONFIG.brandName}.`,
    }
  }
  return {
    title: product.name,
    description: product.description ?? `Discover ${product.name} — a luxury fragrance by ${CONFIG.brandName}.`,
    openGraph: {
      title: `${product.name} | ${CONFIG.brandName}`,
      description: product.description ?? `A luxury fragrance by ${CONFIG.brandName}.`,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProduct(params.slug)
  if (!product) notFound()
  return <ProductDetailClient initialProduct={product} />
}
