import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WIDGET_REGISTRY, WidgetData } from '../_widgets'
import { GripVertical } from 'lucide-react'

interface CanvasItemProps {
  section: WidgetData
  isActive: boolean
  onClick: () => void
}

export function CanvasItem({ section, isActive, onClick }: CanvasItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  const widgetConfig = WIDGET_REGISTRY[section.type]
  const Component = widgetConfig?.component

  if (!Component) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isActive ? 'ring-2 ring-indigo-500 z-10' : 'hover:ring-2 hover:ring-indigo-300 z-0'}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className={`absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-100' : ''}`}
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Widget Render */}
      <div className={`w-full overflow-hidden ${isActive ? '' : 'pointer-events-none'}`}>
        <Component props={section.props} />
      </div>
      
      {/* Overlay to catch clicks on elements inside when not active */}
      {!isActive && (
        <div className="absolute inset-0 z-20 cursor-pointer" />
      )}
    </div>
  )
}
