import { requireSuperAdmin } from '@/lib/session'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { AdminLayout } from '@/presentation/admin/layouts/AdminLayout'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin()
  const session = await getServerSession(authOptions)

  return (
    <AdminLayout
      userEmail={session?.user?.email ?? undefined}
      pageTitle="Control Center"
    >
      {children}
    </AdminLayout>
  )
}
