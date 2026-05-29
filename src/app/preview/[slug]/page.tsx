import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { WidgetData } from '../../admin/templates/[id]/design/_widgets'
import { ClientPreview } from './ClientPreview'

export const dynamic = 'force-dynamic'

export default async function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Format slug back to name (e.g. floral-garden -> floral garden)
  const nameToSearch = slug.replace(/-/g, ' ')
  
  // Find template by name (case insensitive) or by ID if it happens to be an ID
  const template = await prisma.template.findFirst({
    where: {
      OR: [
        { name: { equals: nameToSearch, mode: 'insensitive' } },
        { id: slug }
      ]
    }
  })

  if (!template) notFound()

  // Parse sections from themeConfig
  let sections: WidgetData[] = []
  if (template.themeConfig && typeof template.themeConfig === 'object') {
    const config = template.themeConfig as { sections?: WidgetData[] }
    if (Array.isArray(config.sections)) {
      sections = config.sections
    }
  }

  return <ClientPreview sections={sections} />
}
