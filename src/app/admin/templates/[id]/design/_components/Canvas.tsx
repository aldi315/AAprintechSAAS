import React from 'react'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { WidgetData } from '../_widgets'
import { CanvasItem } from './CanvasItem'
import { Monitor, Smartphone } from 'lucide-react'

interface CanvasProps {
  sections: WidgetData[]
  activeId: string | null
  onSelect: (id: string | null) => void
  onReorder: (oldIndex: number, newIndex: number) => void
  viewMode: 'mobile' | 'desktop'
}

export function Canvas({ sections, activeId, onSelect, onReorder, viewMode }: CanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts to allow clicks
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

  // Width container based on view mode
  const isMobile = viewMode === 'mobile'
  const containerClass = isMobile 
    ? "w-full max-w-[400px] h-[800px] max-h-[85vh] bg-white rounded-3xl shadow-xl border-[12px] border-slate-900 overflow-y-auto overflow-x-hidden relative" 
    : "w-full max-w-5xl h-[800px] max-h-[85vh] bg-white shadow-xl border border-slate-200 overflow-y-auto overflow-x-hidden relative"

  return (
    <div 
      className="w-full flex justify-center pb-20"
      onClick={() => onSelect(null)}
    >
      <div className={containerClass}>
        {sections.length === 0 ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            {isMobile ? <Smartphone className="w-16 h-16 mb-4 opacity-20" /> : <Monitor className="w-16 h-16 mb-4 opacity-20" />}
            <p>Kanvas kosong.</p>
            <p className="text-sm mt-2">Klik komponen di sidebar kiri untuk menambahkan.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col w-full h-full min-h-full">
                {sections.map((section) => (
                  <CanvasItem 
                    key={section.id} 
                    section={section}
                    isActive={activeId === section.id}
                    onClick={() => onSelect(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
