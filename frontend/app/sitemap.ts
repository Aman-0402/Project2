import { MetadataRoute } from 'next'
import { CONFIG } from '@/constants/config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxeparfum.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Fetch products for dynamic routes
  try {
    const res = await fetch(`${CONFIG.apiUrl}/products/`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const { data } = await res.json()
      const productRoutes: MetadataRoute.Sitemap = (data ?? []).map((p: { slug: string; updated_at: string }) => {
        const d = new Date(p.updated_at)
        return {
          url: `${BASE_URL}/products/${p.slug}`,
          lastModified: isNaN(d.getTime()) ? new Date() : d,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }
      })
      return [...staticRoutes, ...productRoutes]
    }
  } catch {
    // Return static only if API unavailable
  }

  return staticRoutes
}
