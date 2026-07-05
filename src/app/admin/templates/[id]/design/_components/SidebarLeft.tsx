import React, { useState } from 'react'
import { WIDGET_REGISTRY, WidgetType } from '../_widgets'
import { Image as ImageIcon, Type, MoveVertical, Plus, Heart, Calendar, Clock, LayoutGrid, Gift, MailOpen, Search, BookOpen, Music, ChevronDown, ChevronRight } from 'lucide-react'

// Simple icon map for now
const ICONS: Record<string, React.ReactNode> = {
  Image: <ImageIcon className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  MoveVertical: <MoveVertical className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  MailOpen: <MailOpen className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />
}

export function SidebarLeft({ onAddWidget }: { onAddWidget: (w: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'General': true,
    'Floral Garden': true,
    'Modern Minimalist': true,
  })

  const filteredWidgets = Object.entries(WIDGET_REGISTRY).filter(([key, widget]) => {
    return widget.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  // Define group logic
  const generalKeys = ['text', 'spacer', 'gift', 'rsvp', 'music']
  const groups = [
    {
      name: 'General',
      items: filteredWidgets.filter(([key]) => generalKeys.includes(key))
    },
    {
      name: 'Floral Garden',
      items: filteredWidgets.filter(([key]) => !key.includes('_minimalist') && !generalKeys.includes(key))
    },
    {
      name: 'Modern Minimalist',
      items: filteredWidgets.filter(([key]) => key.includes('_minimalist'))
    }
  ]

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col shrink-0 h-full">
      <div className="p-4 border-b border-border flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Components</h2>
          <p className="text-xs text-muted-foreground mt-1">Click to add to canvas</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search widget..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto space-y-4">
        {filteredWidgets.length > 0 ? (
          groups.map((group) => {
            if (group.items.length === 0) return null
            const isExpanded = expandedGroups[group.name]

            return (
              <div key={group.name} className="space-y-2">
                <button 
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 w-full px-1 mb-1 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.name}
                  </h3>
                </button>
                
                {isExpanded && (
                  <div className="space-y-2 pl-1">
                    {group.items.map(([key, widget]) => (
                      <button
                        key={key}
                        onClick={() => onAddWidget({ type: key as WidgetType, props: widget.defaultProps })}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent hover:shadow-sm transition-all group bg-card text-left"
                      >
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          {ICONS[widget.icon] || <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary">{widget.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center p-4 text-sm text-muted-foreground">
            No widgets found
          </div>
        )}
      </div>
    </div>
  )
}
