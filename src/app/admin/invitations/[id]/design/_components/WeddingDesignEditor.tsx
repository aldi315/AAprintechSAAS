'use client'

import React, { useState, useTransition } from 'react'
import { ArrowLeft, Save, Loader2, Smartphone, Monitor, PanelLeft, PanelRight, Layers, Settings2, Trash2, Globe, FileEdit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/presentation/components/ui/AlertProvider'
import { saveWeddingDesign, updateWeddingStatus } from '@/application/actions/wedding.actions'
import { Canvas } from '@/app/admin/templates/[id]/design/_components/Canvas'
import { WIDGET_REGISTRY, WidgetData } from '@/app/admin/templates/[id]/design/_widgets'
import { ImagePickerField } from '@/app/admin/templates/[id]/design/_components/ImagePickerField'

interface WeddingDesignEditorProps {
  weddingId: string
  weddingName: string
  weddingSlug: string
  status: string
  templateConfig: any
  customConfig: any
}

export function WeddingDesignEditor({ weddingId, weddingName, weddingSlug, status, templateConfig, customConfig }: WeddingDesignEditorProps) {
  const router = useRouter()
  const { showAlert } = useAlert()
  const [isPending, startTransition] = useTransition()

  // Merge template schema with custom config so we can display them
  // The actual saving will just save the customConfig
  const [sections, setSections] = useState<WidgetData[]>(() => {
    let baseSections = templateConfig?.sections || []
    let customSections = customConfig?.sections || []

    return baseSections.map((sec: any) => {
      const override = customSections.find((cs: any) => cs.id === sec.id)
      if (override) {
        return { ...sec, props: { ...sec.props, ...override.props } }
      }
      return sec
    })
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  const handleToggleStatus = () => {
    const newStatus = status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT'
    startTransition(async () => {
      const res = await updateWeddingStatus(weddingId, newStatus)
      if (res.success) {
        showAlert('Berhasil', `Status undangan berhasil diubah menjadi ${newStatus}.`, 'success')
      } else {
        showAlert('Gagal', res.error || 'Terjadi kesalahan mengubah status.', 'error')
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Only extract sections that differ from base template?
      // For simplicity, we just save all section overrides back to customConfig
      const overrides = {
        ...customConfig,
        theme: customConfig?.theme || templateConfig?.theme || {},
        sections: sections.map(s => ({ id: s.id, type: s.type, props: s.props }))
      }

      const res = await saveWeddingDesign(weddingId, overrides)
      if (res.success) {
        showAlert('Berhasil', 'Desain undangan berhasil disimpan!', 'success')
      } else {
        showAlert('Gagal Menyimpan', res.error || 'Terjadi kesalahan.', 'error')
      }
    } catch (e) {
      showAlert('Gagal', 'Terjadi kesalahan pada sistem.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updateWidget = (id: string, newProps: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, props: newProps } : s))
  }

  // Right Sidebar Properties Render
  const renderProperties = () => {
    const activeSection = sections.find(s => s.id === activeId)

    if (!activeSection) {
      return (
        <div className="text-center text-slate-400 mt-20 px-6">
          <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Klik layer di sebelah kiri atau widget di kanvas untuk mengedit properti data undangan.</p>
        </div>
      )
    }

    const { id, type, props } = activeSection

    const handleChange = (key: string, value: any) => {
      updateWidget(id, { ...props, [key]: value })
    }

    const renderField = (key: string, value: any) => {
      if (typeof value === 'boolean') {
        return (
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={value}
              onChange={e => handleChange(key, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          </label>
        )
      }

      if (typeof value === 'number') {
        return (
          <input
            type="number"
            value={value}
            onChange={e => handleChange(key, Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        )
      }

      if (key.toLowerCase().includes('color')) {
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={e => handleChange(key, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-slate-300"
            />
            <input
              type="text"
              value={value}
              onChange={e => handleChange(key, e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )
      }

      if (key === 'align') {
        return (
          <select
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        )
      }

      if (key === 'targetDate') {
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        )
      }

      if (Array.isArray(value)) {
        if (key === 'accounts') {
          return (
            <div className="space-y-4">
              {value.map((acc, idx) => (
                <div key={idx} className="relative p-3 border border-slate-200 rounded-lg bg-white space-y-2">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => {
                        const newArr = [...value]
                        newArr.splice(idx, 1)
                        handleChange(key, newArr)
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input type="text" value={acc.bankName} onChange={e => { const newArr = [...value]; newArr[idx] = { ...newArr[idx], bankName: e.target.value }; handleChange(key, newArr) }} placeholder="Nama Bank (mis. BCA)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <input type="text" value={acc.accountNumber} onChange={e => { const newArr = [...value]; newArr[idx] = { ...newArr[idx], accountNumber: e.target.value }; handleChange(key, newArr) }} placeholder="Nomor Rekening" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" />
                  <input type="text" value={acc.accountName} onChange={e => { const newArr = [...value]; newArr[idx] = { ...newArr[idx], accountName: e.target.value }; handleChange(key, newArr) }} placeholder="Atas Nama" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              ))}
              <button onClick={() => handleChange(key, [...value, { bankName: '', accountNumber: '', accountName: '' }])} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-300 text-sm font-medium transition-colors">
                + Tambah Akun Bank
              </button>
            </div>
          )
        }

        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo')) {
          return (
            <div className="space-y-4">
              {value.map((imgUrl, idx) => (
                <div key={idx} className="relative p-2 border border-slate-200 rounded-lg bg-white">
                  <div className="absolute -top-2 -right-2 z-10">
                    <button onClick={() => { const newArr = [...value]; newArr.splice(idx, 1); handleChange(key, newArr) }} className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><Trash2 className="w-3 h-3" /></button>
                  </div>
                  <ImagePickerField value={imgUrl} onChange={(newUrl) => { const newArr = [...value]; newArr[idx] = newUrl; handleChange(key, newArr) }} />
                </div>
              ))}
              <button onClick={() => handleChange(key, [...value, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop'])} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-300 text-sm font-medium transition-colors">
                + Tambah Foto
              </button>
            </div>
          )
        }

        return (
          <textarea
            value={value.join('\n')}
            onChange={e => handleChange(key, e.target.value.split('\n').filter(s => s.trim() !== ''))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[100px]"
            placeholder="Pisahkan baris dengan Enter..."
          />
        )
      }

      if (typeof value === 'string' && (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo'))) {
        return <ImagePickerField value={value} onChange={(url) => handleChange(key, url)} />
      }

      return (
        <textarea
          value={value}
          onChange={e => handleChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[60px]"
        />
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Data Properties</h2>
            <p className="text-xs text-slate-500 mt-0.5 capitalize">{type} Widget</p>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {Object.entries(props).map(([key, value]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderField(key, value)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-semibold text-slate-800 leading-tight">
              {weddingName}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-normal text-xs">Editor Undangan</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${leftOpen ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Toggle Left Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${rightOpen ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Toggle Right Sidebar"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          </div>

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

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <button
            onClick={handleToggleStatus}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${status === 'PUBLISHED'
              ? 'border-amber-300 text-amber-700 hover:bg-amber-50 bg-white'
              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white'
              }`}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (status === 'PUBLISHED' ? <FileEdit className="w-4 h-4" /> : <Globe className="w-4 h-4" />)}
            {status === 'PUBLISHED' ? 'Set as Draft' : 'Publish'}
          </button>

          <button
            onClick={() => window.open(`/invitation/${weddingSlug}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-colors"
          >
            Preview Live
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Data
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Read Only Layers */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${leftOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="w-64 h-full bg-white border-r border-slate-200 flex flex-col">
            <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50">
              <Layers className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Template Layers</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              {sections.length === 0 && (
                <p className="text-sm text-slate-500 text-center mt-10">Tidak ada layer pada template ini.</p>
              )}
              {sections.map(section => {
                const isActive = activeId === section.id
                const widgetConfig = WIDGET_REGISTRY[section.type]
                return (
                  <div
                    key={section.id}
                    onClick={() => setActiveId(section.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${isActive
                      ? 'bg-primary/10 border-primary shadow-sm text-primary/80'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <span className="text-sm font-medium">{widgetConfig?.name || section.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center overflow-auto p-4 md:p-8 bg-slate-100 relative">
          <Canvas
            sections={sections}
            activeId={activeId}
            onSelect={setActiveId}
            // no reorder callback since read-only
            onReorder={() => { }}
            viewMode={viewMode}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${rightOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col">
            {renderProperties()}
          </div>
        </div>
      </div>
    </div>
  )
}
