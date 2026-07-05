import { requireReseller } from '@/lib/reseller-guard'
import { getTemplateOptions } from '@/application/queries/wedding.queries'
import { CreateWeddingForm } from './CreateWeddingForm'

export default async function NewWeddingPage() {
  await requireReseller()
  const templates = await getTemplateOptions()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Buat Undangan Baru</h1>
        <p className="text-sm text-slate-500 mt-1">Isi detail pasangan untuk membuat undangan digital.</p>
      </div>
      <CreateWeddingForm templates={templates} />
    </div>
  )
}
