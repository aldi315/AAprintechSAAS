'use client'

import { useState } from 'react'
import { SidebarLeft } from './SidebarLeft'
import { SidebarRight } from './SidebarRight'
import { Canvas } from './Canvas'
import { WidgetData } from '../_widgets'
import { saveTemplateDesign } from '@/application/actions/template.actions'
import { ArrowLeft, Save, Loader2, Smartphone, Monitor } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/presentation/components/ui/AlertProvider'

interface EditorProps {
  templateId: string
  initialConfig: any
  templateName: string
}

export function Editor({ templateId, initialConfig, templateName }: EditorProps) {
  const router = useRouter()
  const { showAlert } = useAlert()
  const [sections, setSections] = useState<WidgetData[]>(initialConfig.sections || [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')

  const handleSave = async () => {
    setSaving(true)
    try {
      const config = {
        ...initialConfig,
        sections
      }
      const res = await saveTemplateDesign(templateId, config)
      if (res.success) {
        showAlert('Berhasil', 'Desain berhasil disimpan!', 'success')
      } else {
        showAlert('Gagal Menyimpan', res.error || 'Terjadi kesalahan.', 'error')
      }
    } catch (e) {
      showAlert('Gagal', 'Terjadi kesalahan pada sistem.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const addWidget = (widget: Omit<WidgetData, 'id'>) => {
    const id = `${widget.type}-${Date.now()}`
    if (widget.type === 'cover') {
      setSections([{ ...widget, id }, ...sections])
    } else {
      setSections([...sections, { ...widget, id }])
    }
    setActiveId(id)
  }

  const updateWidget = (id: string, newProps: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, props: newProps } : s))
  }

  const deleteWidget = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const duplicateWidget = (id: string) => {
    const index = sections.findIndex(s => s.id === id)
    if (index === -1) return
    const widgetToDuplicate = sections[index]
    const newId = `${widgetToDuplicate.type}-${Date.now()}`
    const newWidget = { ...widgetToDuplicate, id: newId }
    
    const newSections = [...sections]
    newSections.splice(index + 1, 0, newWidget)
    setSections(newSections)
    setActiveId(newId)
  }

  const moveWidget = (oldIndex: number, newIndex: number) => {
    const newSections = [...sections]
    const [moved] = newSections.splice(oldIndex, 1)
    newSections.splice(newIndex, 0, moved)
    setSections(newSections)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-800">
            {templateName} <span className="text-slate-400 font-normal text-sm ml-2">Editor</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.open(`/preview/${templateName.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-colors"
          >
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Design
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <SidebarLeft onAddWidget={addWidget} />

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center overflow-auto p-4 md:p-8 bg-slate-100">
          <Canvas 
            sections={sections} 
            activeId={activeId} 
            onSelect={setActiveId} 
            onReorder={moveWidget}
            viewMode={viewMode}
          />
        </div>

        {/* Right Sidebar */}
        <SidebarRight 
          sections={sections} 
          activeId={activeId} 
          onSelect={setActiveId}
          onReorder={moveWidget}
          onUpdate={updateWidget}
          onDelete={deleteWidget}
          onDuplicate={duplicateWidget}
        />
      </div>
    </div>
  )
}
