import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import { CONFIG } from '@/constants/config'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API}/settings/`, { next: { revalidate: 300 } })
    if (!res.ok) return {}
    const json = await res.json()
    return json.data ?? {}
  } catch {
    return {}
  }
}

async function getGalleryImages(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/products/featured/`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    const products: Array<{ image?: string }> = json.data ?? []
    return products
      .map(p => p.image)
      .filter((img): img is string => !!img)
      .slice(0, 6)
  } catch {
    return []
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, galleryImages] = await Promise.all([
    getSiteSettings(),
    getGalleryImages(),
  ])

  const instagramUrl = settings.instagram_url || CONFIG.instagram
  const facebookUrl  = settings.facebook_url  || CONFIG.facebook
  const youtubeUrl   = settings.youtube_url   || CONFIG.youtube

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
        youtubeUrl={youtubeUrl}
        galleryImages={galleryImages}
      />
    </>
  )
}
