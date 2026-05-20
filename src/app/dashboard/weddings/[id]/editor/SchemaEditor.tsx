'use client'
/**
 * SchemaEditor — Main editor wrapper: section list + theme panel + live preview
 */
import { useState, useTransition } from 'react'
import { updateSchemaAction } from '../../_actions/schema.actions'
import { SectionListEditor } from './SectionListEditor'
import { ThemeEditor } from './ThemeEditor'
import { LivePreview } from './LivePreview'
import { Button } from '@/presentation/dashboard/components/ui/Button'
import { Save, Eye, Palette, Layers } from 'lucide-react'

interface SectionItem {
  id: string
  type: string
  enabled: boolean
  props: Record<string, unknown>
}

interface ThemeData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontHeading: string
  fontScript: string
  fontBody: string
}

interface Props {
  weddingId: string
  weddingSlug: string
  initialSchema: {
    version: number
    theme: ThemeData
    sections: SectionItem[]
  }
}

export function SchemaEditor({ weddingId, weddingSlug, initialSchema }: Props) {
  const [sections, setSections] = useState<SectionItem[]>(initialSchema.sections)
  const [theme, setTheme] = useState<ThemeData>(initialSchema.theme)
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    setError('')
    setSaved(false)
    startTransition(async () => {
      const result = await updateSchemaAction({
        weddingId,
        sections,
        theme,
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? 'Gagal menyimpan.')
      }
    })
  }

  const tabs = [
    { key: 'sections' as const, label: 'Sections', icon: Layers },
    { key: 'theme' as const, label: 'Theme', icon: Palette },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* Left: Preview */}
      <div className="order-2 lg:order-1">
        <LivePreview slug={weddingSlug} />
      </div>

      {/* Right: Editor panel */}
      <div className="order-1 lg:order-2 space-y-4">
        {/* Tab switcher */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'sections' ? (
            <SectionListEditor sections={sections} onChange={setSections} />
          ) : (
            <ThemeEditor theme={theme} onChange={setTheme} />
          )}
        </div>

        {/* Save bar */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} loading={isPending} icon={<Save className="w-4 h-4" />}>
            Simpan
          </Button>
          <a
            href={`/${weddingSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </a>
          {saved && <span className="text-sm text-emerald-600">✓ Tersimpan</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>
    </div>
  )
}
