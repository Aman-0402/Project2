import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import LuxuryCursor from '@/components/ui/LuxuryCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxuryCursor />
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
