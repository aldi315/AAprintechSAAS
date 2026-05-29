import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminSettingsView } from './_components/AdminSettingsView'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/admin')
  }

  const user = session.user

  let adminTenant = null
  if (user.tenantId) {
    adminTenant = await (prisma as any).tenant.findUnique({
      where: { id: user.tenantId },
      select: {
        id: true,
        businessName: true,
        slug: true,
        subscriptionStatus: true
      }
    })
  }

  const adminUser = {
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role ?? 'SUPER_ADMIN'
  }

  return <AdminSettingsView adminTenant={adminTenant} adminUser={adminUser} />
}
