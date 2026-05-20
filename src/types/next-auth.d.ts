/**
 * NextAuth v4 — Type Augmentation (tenant-aware)
 * Extend default Session dan JWT types agar TypeScript aware
 * terhadap custom fields: id, role, tenantId, tenantSlug.
 */
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'SUPER_ADMIN' | 'TENANT'
      tenantId: string | null
      tenantSlug: string | null
    } & DefaultSession['user']
  }

  interface User {
    role: 'SUPER_ADMIN' | 'TENANT'
    tenantId: string | null
    tenantSlug: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'SUPER_ADMIN' | 'TENANT'
    tenantId: string | null
    tenantSlug: string | null
  }
}
