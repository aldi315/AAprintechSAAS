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
          ? 'bg-primary/10 border-primary/30 shadow-sm' 
          : 'bg-card border-border hover:border-muted-foreground/30'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 -ml-1 rounded"
        onClick={(e) => e.stopPropagation()} // Prevent click when dragging
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className={`p-1.5 rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {widgetConfig ? (ICONS[widgetConfig.icon] || <LayoutGrid className="w-4 h-4" />) : <LayoutGrid className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
          {widgetConfig?.name || section.type}
        </p>
      </div>

      <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-popover rounded-lg shadow-lg border border-border py-1 z-[100]">
            <button
              onClick={() => {
                onDuplicate()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={() => {
                onDelete()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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
