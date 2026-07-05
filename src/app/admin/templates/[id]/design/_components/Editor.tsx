'use client'

import { useState } from 'react'
import { SidebarLeft } from './SidebarLeft'
import { SidebarRight } from './SidebarRight'
import { Canvas } from './Canvas'
import { WidgetData } from '../_widgets'
import { saveTemplateDesign } from '@/application/actions/template.actions'
import { ArrowLeft, Save, Loader2, Smartphone, Monitor, PanelLeft, PanelRight } from 'lucide-react'
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
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

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
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Topbar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-accent-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-foreground">
            {templateName} <span className="text-muted-foreground font-normal text-sm ml-2">Editor</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${leftOpen ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Toggle Left Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${rightOpen ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Toggle Right Sidebar"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'mobile' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'desktop' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.open(`/preview/${templateName.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border hover:bg-accent text-foreground rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-sm shadow-primary/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Design
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${leftOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="w-64 h-full">
            <SidebarLeft onAddWidget={addWidget} />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center overflow-auto p-4 md:p-8 bg-muted/20 relative">
          <Canvas 
            sections={sections} 
            activeId={activeId} 
            onSelect={setActiveId} 
            onReorder={moveWidget}
            viewMode={viewMode}
          />
        </div>

        {/* Right Sidebar */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${rightOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="w-80 h-full">
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
      </div>
    </div>
  )
}
