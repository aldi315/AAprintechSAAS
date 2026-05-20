import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { DashboardLayout } from '@/presentation/dashboard/layouts/DashboardLayout'

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireTenant()
  const session = await getServerSession(authOptions)

  // Fetch tenant name
  const tenant = await (prisma as any).tenant.findFirst({
    where: { id: ctx.tenantId },
    select: { businessName: true },
  })

  return (
    <DashboardLayout
      userName={session?.user?.name ?? undefined}
      userEmail={session?.user?.email ?? undefined}
      tenantName={tenant?.businessName ?? undefined}
    >
      {children}
    </DashboardLayout>
  )
}
