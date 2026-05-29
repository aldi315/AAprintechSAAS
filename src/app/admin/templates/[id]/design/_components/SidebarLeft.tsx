import React from 'react'
import { WIDGET_REGISTRY, WidgetType } from '../_widgets'
import { Image as ImageIcon, Type, MoveVertical, Plus, Heart, Calendar, Clock, LayoutGrid, Gift } from 'lucide-react'

// Simple icon map for now
const ICONS: Record<string, React.ReactNode> = {
  Image: <ImageIcon className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  MoveVertical: <MoveVertical className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />
}

export function SidebarLeft({ onAddWidget }: { onAddWidget: (w: any) => void }) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Components</h2>
        <p className="text-xs text-slate-500 mt-1">Click to add to canvas</p>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto space-y-2">
        {Object.entries(WIDGET_REGISTRY).map(([key, widget]) => (
          <button
            key={key}
            onClick={() => onAddWidget({ type: key as WidgetType, props: widget.defaultProps })}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-sm transition-all group bg-white text-left"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
              {ICONS[widget.icon] || <Plus className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{widget.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
