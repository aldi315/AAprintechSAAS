import { notFound } from 'next/navigation'
import { requireTenant } from '@/lib/tenant-guard'
import { getWeddingById, getTemplateOptions } from '@/application/queries/wedding.queries'
import { EditWeddingForm } from './EditWeddingForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditWeddingPage({ params }: PageProps) {
  const { id } = await params
  const ctx = await requireTenant()
  const [wedding, templates] = await Promise.all([
    getWeddingById(ctx.tenantId, id),
    getTemplateOptions(),
  ])

  if (!wedding) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Undangan</h1>
        <p className="text-sm text-slate-500 mt-1">{wedding.brideName} & {wedding.groomName}</p>
      </div>
      <EditWeddingForm wedding={wedding} templates={templates} />
    </div>
  )
}
