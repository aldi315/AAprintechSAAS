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

  let adminReseller = null
  if (user.resellerId) {
    adminReseller = await (prisma as any).reseller.findUnique({
      where: { id: user.resellerId },
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

  return <AdminSettingsView adminReseller={adminReseller} adminUser={adminUser} />
}
