import { notFound } from 'next/navigation'
import { requireReseller } from '@/lib/reseller-guard'
import { getWeddingById } from '@/application/queries/wedding.queries'
import { prisma } from '@/lib/prisma'
import { SchemaEditor } from './SchemaEditor'
import { getEffectiveConfig } from '@/application/queries/wedding-config.queries'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params
  const ctx = await requireReseller()
  const wedding = await getWeddingById(ctx.resellerId, id)
  if (!wedding) notFound()

  // Load template (untuk nama) + konfigurasi efektif milik wedding ini
  const [template, weddingConfig] = await Promise.all([
    (prisma as any).template.findFirst({
      where: { id: wedding.templateId },
      select: { id: true, name: true },
    }),
    (prisma as any).wedding.findFirst({
      where: { id: wedding.id, resellerId: ctx.resellerId },
      select: { templateId: true, customConfig: true },
    }),
  ])

  const schema = (weddingConfig
    ? await getEffectiveConfig(weddingConfig)
    : { version: 1, theme: {}, sections: [] }) as any

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Editor Undangan</h1>
        <p className="text-sm text-slate-500 mt-1">
          {wedding.brideName} & {wedding.groomName} — Template: {template?.name ?? '-'}
        </p>
      </div>
      <SchemaEditor
        weddingId={wedding.id}
        weddingSlug={wedding.slug}
        initialSchema={schema}
      />
    </div>
  )
}
