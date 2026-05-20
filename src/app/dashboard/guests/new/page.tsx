import { requireTenant } from '@/lib/tenant-guard'
import { getWeddingsByTenant } from '@/application/queries/wedding.queries'
import { CreateGuestForm } from './CreateGuestForm'

export default async function NewGuestPage() {
  const ctx = await requireTenant()
  const { items: weddings } = await getWeddingsByTenant(ctx.tenantId, 1, 100)

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tambah Tamu</h1>
        <p className="text-sm text-slate-500 mt-1">Tambahkan tamu baru ke undangan.</p>
      </div>
      <CreateGuestForm weddings={weddings.map(w => ({ id: w.id, label: `${w.brideName} & ${w.groomName} (/${w.slug})` }))} />
    </div>
  )
}
