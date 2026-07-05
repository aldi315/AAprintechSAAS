import React from 'react'

export const defaultTextProps = {
  content: 'Join us to celebrate our special day.',
  fontSize: 16,
  color: '#333333',
  align: 'center' as 'left' | 'center' | 'right' | 'justify',
  fontFamily: 'sans-serif' as 'sans-serif' | 'serif' | 'cursive',
  padding: '24px'
}

export function TextWidget({ props }: { props: typeof defaultTextProps }) {
  return (
    <div style={{ padding: props.padding }}>
      <p 
        style={{ 
          fontSize: `${props.fontSize}px`, 
          color: props.color,
          textAlign: props.align,
          fontFamily: props.fontFamily === 'serif' ? 'Georgia, serif' : props.fontFamily === 'cursive' ? '"Great Vibes", cursive' : 'sans-serif',
          lineHeight: 1.6
        }}
      >
        {props.content}
      </p>
    </div>
  )
}
