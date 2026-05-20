import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
  const ctx = await requireTenant()
  const tenant = await (prisma as any).tenant.findFirst({
    where: { id: ctx.tenantId },
    select: { id: true, businessName: true, slug: true, settings: true },
  })

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola profil bisnis Anda.</p>
      </div>
      <SettingsForm tenant={tenant} />
    </div>
  )
}
