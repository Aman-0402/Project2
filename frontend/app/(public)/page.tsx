import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LUXE PARFUM — The Art of Scent',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <p className="label-luxury mb-4">Coming Soon</p>
        <h1 className="heading-luxury">LUXE PARFUM</h1>
        <div className="gold-divider mx-auto" />
        <p className="font-sans text-brown/60 text-sm mt-4">Homepage — Phase 5</p>
      </div>
    </div>
  )
}
