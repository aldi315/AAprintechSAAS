import { requireTenant } from '@/lib/tenant-guard'
import { getTemplateOptions } from '@/application/queries/wedding.queries'
import { Card } from '@/presentation/dashboard/components/ui/Card'
import { Palette, CheckCircle2 } from 'lucide-react'

export default async function TemplatesPage() {
  await requireTenant()
  const templates = await getTemplateOptions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Template Galeri</h1>
        <p className="text-sm text-slate-500 mt-1">Pilih desain tema undangan pernikahan Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template: any) => (
          <Card key={template.id} className="group hover:border-[#C8A882] transition-all overflow-hidden flex flex-col" padding={false}>
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <Palette className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
              {template.premium && (
                <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full border border-amber-200">
                  PREMIUM
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex flex-col flex-1">
              <h3 className="font-semibold text-slate-800">{template.name}</h3>
              <p className="text-xs text-slate-500 mt-1 capitalize">{template.category}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  Tersedia untuk semua undangan
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
