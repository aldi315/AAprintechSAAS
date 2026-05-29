import React, { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WidgetData, WIDGET_REGISTRY } from '../_widgets'
import { GripVertical, Image as ImageIcon, Type, MoveVertical, Heart, Calendar, Clock, LayoutGrid, Gift, MoreVertical, Copy, Trash2, Music, BookOpen } from 'lucide-react'

// Simple icon map for now
const ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  MoveVertical: <MoveVertical className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />
}

interface SidebarLayerItemProps {
  section: WidgetData
  isActive: boolean
  onClick: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function SidebarLayerItem({ section, isActive, onClick, onDelete, onDuplicate }: SidebarLayerItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : showMenu ? 40 : 1,
  }

  const widgetConfig = WIDGET_REGISTRY[section.type]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all relative ${
        isActive 
          ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 -ml-1 rounded"
        onClick={(e) => e.stopPropagation()} // Prevent click when dragging
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className={`p-1.5 rounded-md ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
        {widgetConfig ? (ICONS[widgetConfig.icon] || <LayoutGrid className="w-4 h-4" />) : <LayoutGrid className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
          {widgetConfig?.name || section.type}
        </p>
      </div>

      <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[100]">
            <button
              onClick={() => {
                onDuplicate()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={() => {
                onDelete()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
