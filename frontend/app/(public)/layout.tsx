import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
