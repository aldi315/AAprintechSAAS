import React from 'react'

export const defaultSpacerProps = {
  height: 40,
  showLine: false,
  lineColor: '#e2e8f0',
  lineStyle: 'solid' as 'solid' | 'dashed' | 'dotted'
}

export function SpacerWidget({ props }: { props: typeof defaultSpacerProps }) {
  return (
    <div 
      className="w-full flex items-center justify-center"
      style={{ height: `${props.height}px` }}
    >
      {props.showLine && (
        <div 
          className="w-2/3 border-t"
          style={{ 
            borderColor: props.lineColor,
            borderStyle: props.lineStyle,
            borderWidth: '1px'
          }}
        />
      )}
    </div>
  )
}
