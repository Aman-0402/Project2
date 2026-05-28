import type { Metadata } from 'next'
import CreateFragranceClient from './CreateFragranceClient'

export const metadata: Metadata = {
  title: 'Create Your Fragrance | M.M ATTARWALA',
  description: 'Design your personalized signature perfume in a 5-step interactive experience. Choose your notes, intensity, and occasion.',
  openGraph: {
    title: 'Craft Your Signature Fragrance | M.M ATTARWALA',
    description: 'Designed by you. Blended to perfection. Create a scent that tells your story.',
  },
}

export default function CreateFragrancePage() {
  return <CreateFragranceClient />
}
