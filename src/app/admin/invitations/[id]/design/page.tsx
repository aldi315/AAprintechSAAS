import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { WeddingDesignEditor } from './_components/WeddingDesignEditor'

export default async function WeddingDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const wedding = await prisma.wedding.findUnique({
    where: { id },
    include: { template: true }
  })

  if (!wedding) {
    notFound()
  }

  // Parse template themeConfig
  let templateConfig = { theme: {}, sections: [] }
  if (wedding.template.themeConfig) {
    try {
      templateConfig = typeof wedding.template.themeConfig === 'string' 
        ? JSON.parse(wedding.template.themeConfig) 
        : wedding.template.themeConfig
        
      if (!templateConfig.sections) templateConfig.sections = []
    } catch (e) {
      console.error('Error parsing themeConfig:', e)
    }
  }

  // Parse wedding customConfig
  let customConfig = { theme: {}, sections: [] }
  if (wedding.customConfig) {
    try {
      customConfig = typeof wedding.customConfig === 'string'
        ? JSON.parse(wedding.customConfig)
        : wedding.customConfig
        
      if (!customConfig.sections) customConfig.sections = []
    } catch (e) {
      console.error('Error parsing customConfig:', e)
    }
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden">
      <WeddingDesignEditor 
        weddingId={wedding.id} 
        weddingName={`${wedding.brideName} & ${wedding.groomName}`}
        weddingSlug={wedding.slug}
        status={wedding.status}
        templateConfig={templateConfig} 
        customConfig={customConfig}
      />
    </div>
  )
}
