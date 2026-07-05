import { requireReseller } from '@/lib/reseller-guard'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { DashboardLayout } from '@/presentation/dashboard/layouts/DashboardLayout'

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireReseller()
  const session = await getServerSession(authOptions)

  // Fetch reseller name
  const reseller = await (prisma as any).reseller.findFirst({
    where: { id: ctx.resellerId },
    select: { businessName: true },
  })

  return (
    <DashboardLayout
      userName={session?.user?.name ?? undefined}
      userEmail={session?.user?.email ?? undefined}
      resellerName={reseller?.businessName ?? undefined}
    >
      {children}
    </DashboardLayout>
  )
}
