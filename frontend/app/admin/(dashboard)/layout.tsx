import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
