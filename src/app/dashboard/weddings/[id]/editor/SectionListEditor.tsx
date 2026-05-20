'use client'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { GripVertical, ChevronDown, ChevronUp } from 'lucide-react'

interface SectionItem {
  id: string
  type: string
  enabled: boolean
  props: Record<string, unknown>
}

interface Props {
  sections: SectionItem[]
  onChange: (sections: SectionItem[]) => void
}

export function SectionListEditor({ sections, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleEnable = (id: string) => {
    onChange(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sections.length - 1) return

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newSections[index]
    newSections[index] = newSections[targetIndex]
    newSections[targetIndex] = temp
    onChange(newSections)
  }

  const updateProps = (id: string, newProps: Record<string, unknown>) => {
    onChange(sections.map(s => s.id === id ? { ...s, props: newProps } : s))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Section List</h3>
        <p className="text-xs text-slate-500">Urutan & Visibilitas</p>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div key={section.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            {/* Header / row */}
            <div className="flex items-center gap-3 p-3 bg-slate-50/50">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 capitalize">{section.type}</p>
                <p className="text-xs text-slate-400 font-mono">{section.id}</p>
              </div>

              <Switch
                checked={section.enabled}
                onChange={() => toggleEnable(section.id)}
                className={`${section.enabled ? 'bg-[#C8A882]' : 'bg-slate-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
              >
                <span className={`${section.enabled ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
              </Switch>

              <button
                onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === section.id ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expanded properties editor */}
            {expandedId === section.id && (
              <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Properties</p>
                {Object.entries(section.props).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <label className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                    {typeof value === 'boolean' ? (
                      <Switch
                        checked={value as boolean}
                        onChange={(val: boolean) => updateProps(section.id, { ...section.props, [key]: val })}
                        className={`${value ? 'bg-emerald-500' : 'bg-slate-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
                      >
                        <span className={`${value ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                    ) : typeof value === 'number' ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateProps(section.id, { ...section.props, [key]: Number(e.target.value) })}
                        className="w-20 px-2 py-1 text-sm border rounded"
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => updateProps(section.id, { ...section.props, [key]: e.target.value })}
                        className="w-full max-w-[200px] px-2 py-1 text-sm border rounded"
                      />
                    )}
                  </div>
                ))}
                {Object.keys(section.props).length === 0 && (
                  <p className="text-xs text-slate-400">Tidak ada properti yang bisa diubah.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
