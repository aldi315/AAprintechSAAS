'use client'
/**
 * PRESENTATION — ThemeProvider
 * Inject CSS variables dari ThemeSchema ke DOM via inline style.
 */
import { useMemo } from 'react'
import type { ThemeSchema } from '@/core/entities/template-schema.entity'
import { buildThemeCssVars } from '@/presentation/invitation/themes/theme.config'

interface ThemeProviderProps {
  theme: ThemeSchema
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const cssVars = useMemo(() => buildThemeCssVars(theme), [theme])

  return (
    <div style={cssVars as React.CSSProperties} className="inv-root min-h-screen">
      {children}
    </div>
  )
}
