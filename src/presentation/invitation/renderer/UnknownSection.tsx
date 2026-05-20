/**
 * PRESENTATION — UnknownSection
 * Graceful fallback untuk section type yang belum diimplementasikan.
 * Hanya muncul di development mode.
 */
import type { SectionComponentProps } from '@/presentation/invitation/registry/section.registry'

export function UnknownSection({ props }: SectionComponentProps) {
  if (process.env.NODE_ENV !== 'development') return null
  return (
    <div className="mx-4 my-2 p-3 border border-dashed border-amber-400 rounded-lg bg-amber-50 text-amber-800 text-xs font-mono">
      ⚠️ Unknown section type — tidak ada component yang terdaftar untuk section ini.
    </div>
  )
}
