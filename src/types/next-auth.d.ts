/**
 * NextAuth v4 — Type Augmentation (reseller-aware)
 * Extend default Session dan JWT types agar TypeScript aware
 * terhadap custom fields: id, role, resellerId, resellerSlug.
 */
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'SUPER_ADMIN' | 'RESELLER'
      resellerId: string | null
      resellerSlug: string | null
    } & DefaultSession['user']
  }

  interface User {
    role: 'SUPER_ADMIN' | 'RESELLER'
    resellerId: string | null
    resellerSlug: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'SUPER_ADMIN' | 'RESELLER'
    resellerId: string | null
    resellerSlug: string | null
  }
}
