import { notFound } from 'next/navigation'
import { requireTenant } from '@/lib/tenant-guard'
import { getWeddingById } from '@/application/queries/wedding.queries'
import { prisma } from '@/lib/prisma'
import { SchemaEditor } from './SchemaEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params
  const ctx = await requireTenant()
  const wedding = await getWeddingById(ctx.tenantId, id)
  if (!wedding) notFound()

  // Load template schema
  const template = await (prisma as any).template.findFirst({
    where: { id: wedding.templateId },
    select: { id: true, name: true, themeConfig: true },
  })

  const schema = (template?.themeConfig as any) ?? {
    version: 1,
    theme: {},
    sections: [],
  }

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
