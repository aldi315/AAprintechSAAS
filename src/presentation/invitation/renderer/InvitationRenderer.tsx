'use client'
/**
 * PRESENTATION — InvitationRenderer (Client Component)
 *
 * Core renderer engine:
 * 1. Baca template schema
 * 2. Filter enabled sections
 * 3. Resolve section component dari registry
 * 4. Render dengan wedding data + theme + guest context
 */
import { ThemeProvider } from '@/presentation/invitation/providers/ThemeProvider'
import { resolveSection } from '@/presentation/invitation/registry/section.registry'
import { parseTemplateSchema } from '@/presentation/invitation/schemas/template.schema'
import type { InvitationRenderDTO } from '@/core/entities/invitation-render.entity'

interface InvitationRendererProps {
  data: InvitationRenderDTO
  guestName?: string
  guestCode?: string
}

export function InvitationRenderer({ data, guestName, guestCode }: InvitationRendererProps) {
  // Parse schema dari template.themeConfig
  const schema = parseTemplateSchema(data.template.themeConfig)
  const { theme, sections } = schema

  // Filter hanya section yang enabled
  const enabledSections = sections.filter((s) => s.enabled)

  return (
    <ThemeProvider theme={theme}>
      {/* Background global dari theme */}
      <div
        className="invitation-container"
        style={{ backgroundColor: 'var(--inv-bg)', color: 'var(--inv-text)' }}
      >
        {enabledSections.map((section) => {
          const SectionComponent = resolveSection(section.type)
          return (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="inv-section"
            >
              <SectionComponent
                data={data}
                props={section.props as Record<string, unknown>}
                guestName={guestName}
                guestCode={guestCode}
              />
            </section>
          )
        })}
      </div>
    </ThemeProvider>
  )
}
