'use client'
/**
 * SpacerSection — Public renderer for spacer/divider sections.
 */
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function SpacerSection({ props }: SectionComponentProps) {
  const height = (props.height as number) ?? 40
  const showLine = (props.showLine as boolean) ?? false
  const lineColor = (props.lineColor as string) ?? 'var(--inv-primary)'
  const lineStyle = (props.lineStyle as string) ?? 'solid'

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      {showLine && (
        <div
          className="w-2/3"
          style={{
            borderTopWidth: '1px',
            borderTopColor: lineColor,
            borderTopStyle: lineStyle as any,
          }}
        />
      )}
    </div>
  )
}
