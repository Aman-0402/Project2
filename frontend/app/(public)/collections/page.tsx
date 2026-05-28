import type { Metadata } from 'next'
import CollectionsClient from './CollectionsClient'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse the full M M ATTARWALA collection — Oud, Floral, Oriental, Citrus, Woody, and Fresh luxury fragrances.',
  openGraph: {
    title: 'Collections | M M ATTARWALA',
    description: 'Discover our exclusive range of luxury perfumes crafted from rare, hand-selected ingredients.',
  },
}

export default function CollectionsPage() {
  return <CollectionsClient />
}
