'use client'

import React from 'react'
import { WIDGET_REGISTRY, WidgetData } from '../../admin/templates/[id]/design/_widgets'

interface ClientPreviewProps {
  sections: WidgetData[]
}

export function ClientPreview({ sections }: ClientPreviewProps) {
  return (
    <div className="w-full min-h-screen bg-white relative overflow-x-hidden flex flex-col">
      {sections.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Template masih kosong
          </div>
        ) : (
          sections.map(section => {
            const widgetDef = WIDGET_REGISTRY[section.type]
            if (!widgetDef) return null
            const WidgetComponent = widgetDef.component
            // Merge default props with stored props
            const mergedProps = { ...widgetDef.defaultProps, ...(section.props || {}) }
            
            return (
              <React.Fragment key={section.id}>
                <WidgetComponent props={mergedProps} isPreview={true} />
              </React.Fragment>
            )
          })
        )}
    </div>
  )
}
