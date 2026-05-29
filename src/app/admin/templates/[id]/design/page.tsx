import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Editor } from './_components/Editor'

export default async function TemplateDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const template = await prisma.template.findUnique({
    where: { id }
  })

  if (!template) {
    notFound()
  }

  // Parse themeConfig safely
  let themeConfig = { theme: {}, sections: [] }
  if (template.themeConfig) {
    try {
      themeConfig = typeof template.themeConfig === 'string' 
        ? JSON.parse(template.themeConfig) 
        : template.themeConfig
        
      if (!themeConfig.sections) themeConfig.sections = []
    } catch (e) {
      console.error('Error parsing themeConfig:', e)
    }
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">
      <Editor templateId={template.id} initialConfig={themeConfig} templateName={template.name} />
    </div>
  )
}
