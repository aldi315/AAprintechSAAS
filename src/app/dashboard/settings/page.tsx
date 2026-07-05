import { requireReseller } from '@/lib/reseller-guard'
import { prisma } from '@/lib/prisma'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
  const ctx = await requireReseller()
  const tenant = await (prisma as any).reseller.findFirst({
    where: { id: ctx.resellerId },
    select: { id: true, businessName: true, slug: true, settings: true },
  })

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola profil bisnis Anda.</p>
      </div>
      <SettingsForm tenant={tenant} />
    </div>
  )
}
