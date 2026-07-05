import { requireReseller } from '@/lib/reseller-guard'
import { getWeddingsByReseller } from '@/application/queries/wedding.queries'
import { CreateGuestForm } from './CreateGuestForm'

export default async function NewGuestPage() {
  const ctx = await requireReseller()
  const { items: weddings } = await getWeddingsByReseller(ctx.resellerId, 1, 100)

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
