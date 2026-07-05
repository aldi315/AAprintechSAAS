import React, { useState, useEffect } from 'react'
import { WidgetData } from '../_widgets'
import { Trash2, Layers, Settings2 } from 'lucide-react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SidebarLayerItem } from './SidebarLayerItem'
import { ImagePickerField } from './ImagePickerField'

interface SidebarRightProps {
  sections: WidgetData[]
  activeId: string | null
  onSelect: (id: string | null) => void
  onReorder: (oldIndex: number, newIndex: number) => void
  onUpdate: (id: string, newProps: any) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function SidebarRight({ sections, activeId, onSelect, onReorder, onUpdate, onDelete, onDuplicate }: SidebarRightProps) {
  const [tab, setTab] = useState<'layers' | 'properties'>('layers')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-switch to properties when a widget is selected
  useEffect(() => {
    if (activeId) {
      setTab('properties')
    }
  }, [activeId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id)
      const newIndex = sections.findIndex(s => s.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  const renderLayers = () => {
    if (sections.length === 0) {
      return (
        <div className="text-center text-muted-foreground mt-20">
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Belum ada layer.</p>
        </div>
      )
    }

    if (!isMounted) return null

    return (
      <DndContext 
        id="dnd-sidebar-right"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2 p-4">
            {sections.map((section) => (
              <SidebarLayerItem 
                key={section.id} 
                section={section}
                isActive={activeId === section.id}
                onClick={() => onSelect(section.id)}
                onDelete={() => onDelete(section.id)}
                onDuplicate={() => onDuplicate(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  const renderProperties = () => {
    const activeSection = sections.find(s => s.id === activeId)

    if (!activeSection) {
      return (
        <div className="text-center text-muted-foreground mt-20 px-6">
          <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Klik layer atau widget di kanvas untuk melihat propertinya.</p>
        </div>
      )
    }

    const { id, type, props } = activeSection

    const handleChange = (key: string, value: any) => {
      onUpdate(id, { ...props, [key]: value })
    }

    const renderField = (key: string, value: any) => {
      if (typeof value === 'boolean') {
        return (
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              checked={value} 
              onChange={e => handleChange(key, e.target.checked)}
              className="w-4 h-4 rounded border-input text-primary focus:ring-ring bg-background"
            />
            <span className="text-sm font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          </label>
        )
      }

      if (typeof value === 'number') {
        return (
          <input 
            type="number" 
            value={value} 
            onChange={e => handleChange(key, Number(e.target.value))}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-8 h-8 rounded cursor-pointer border border-input bg-background"
            />
            <input 
              type="text" 
              value={value} 
              onChange={e => handleChange(key, e.target.value)}
              className="flex-1 px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )
      }

      if (key === 'align') {
        return (
          <select 
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        )
      }

      // Special Date Picker for Countdown Target Date
      if (key === 'targetDate') {
        return (
          <input 
            type="datetime-local" 
            value={value} 
            onChange={e => handleChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )
      }

      if (Array.isArray(value)) {
        // Special case for arrays of objects (like 'accounts' in GiftWidget)
        if (key === 'accounts') {
          return (
            <div className="space-y-4">
              {value.map((acc, idx) => (
                <div key={idx} className="relative p-3 border border-border rounded-lg bg-card space-y-2">
                  <div className="absolute top-2 right-2 z-10">
                    <button 
                      onClick={() => {
                        const newArr = [...value]
                        newArr.splice(idx, 1)
                        handleChange(key, newArr)
                      }}
                      className="p-1 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={acc.bankName} 
                    onChange={e => {
                      const newArr = [...value]
                      newArr[idx] = { ...newArr[idx], bankName: e.target.value }
                      handleChange(key, newArr)
                    }}
                    placeholder="Nama Bank (mis. BCA)"
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input 
                    type="text" 
                    value={acc.accountNumber} 
                    onChange={e => {
                      const newArr = [...value]
                      newArr[idx] = { ...newArr[idx], accountNumber: e.target.value }
                      handleChange(key, newArr)
                    }}
                    placeholder="Nomor Rekening"
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                  <input 
                    type="text" 
                    value={acc.accountName} 
                    onChange={e => {
                      const newArr = [...value]
                      newArr[idx] = { ...newArr[idx], accountName: e.target.value }
                      handleChange(key, newArr)
                    }}
                    placeholder="Atas Nama"
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <button 
                onClick={() => handleChange(key, [...value, { bankName: '', accountNumber: '', accountName: '' }])}
                className="w-full py-2 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 text-sm font-medium transition-colors"
              >
                + Tambah Akun Bank
              </button>
            </div>
          )
        }

        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo')) {
          return (
            <div className="space-y-4">
              {value.map((imgUrl, idx) => (
                <div key={idx} className="relative p-2 border border-border rounded-lg bg-card">
                  <div className="absolute -top-2 -right-2 z-10">
                    <button 
                      onClick={() => {
                        const newArr = [...value]
                        newArr.splice(idx, 1)
                        handleChange(key, newArr)
                      }}
                      className="p-1 bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <ImagePickerField 
                    value={imgUrl} 
                    onChange={(newUrl) => {
                      const newArr = [...value]
                      newArr[idx] = newUrl
                      handleChange(key, newArr)
                    }} 
                  />
                </div>
              ))}
              <button 
                onClick={() => handleChange(key, [...value, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop'])}
                className="w-full py-2 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/50 text-sm font-medium transition-colors"
              >
                + Tambah Foto
              </button>
            </div>
          )
        }

        return (
          <textarea 
            value={value.join('\n')} 
            onChange={e => handleChange(key, e.target.value.split('\n').filter(s => s.trim() !== ''))}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
            placeholder="Pisahkan dengan baris baru (Enter)..."
          />
        )
      }

      // Check for image/photo key for single string
      if (typeof value === 'string' && (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo'))) {
        return (
          <ImagePickerField 
            value={value} 
            onChange={(url) => handleChange(key, url)} 
          />
        )
      }

      return (
        <textarea 
          value={value} 
          onChange={e => handleChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]"
        />
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/50">
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Properties</h2>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{type} Widget</p>
          </div>
          <button 
            onClick={() => onDelete(id)}
            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete Widget"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {Object.entries(props).map(([key, value]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground capitalize">
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
    <div className="w-80 bg-card border-l border-border flex flex-col shrink-0 h-full">
      {/* Tabs */}
      <div className="flex items-center p-2 border-b border-border shrink-0">
        <button
          onClick={() => setTab('layers')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
            tab === 'layers' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Layers
        </button>
        <button
          onClick={() => setTab('properties')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
            tab === 'properties' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          Properties
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tab === 'layers' ? renderLayers() : renderProperties()}
      </div>
    </div>
  )
}
