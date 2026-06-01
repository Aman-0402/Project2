import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
