/**
 * INFRASTRUCTURE LAYER — NextAuth v4 Configuration (production-grade)
 *
 * Tenant-aware session: menyimpan resellerId + resellerSlug di JWT
 * agar setiap Server Component bisa tahu context tenant tanpa query DB.
 */
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginUseCase } from '@/infrastructure/auth/auth.container'

// Validasi environment wajib saat startup
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('[Auth] NEXTAUTH_SECRET tidak ditemukan di environment variables.')
}

export const authOptions: NextAuthOptions = {
  // ─── Session ───────────────────────────────────────────────────────────────
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  },

  // ─── Cookie (Production-secure) ────────────────────────────────────────────
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // ─── Providers ─────────────────────────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await loginUseCase.execute({
            email: credentials.email,
            password: credentials.password,
          })
          // Return user — NextAuth akan meneruskan ke jwt callback
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as 'SUPER_ADMIN' | 'RESELLER',
            resellerId: user.resellerId,
            resellerSlug: user.resellerSlug,
          }
        } catch {
          // Kembalikan null — NextAuth akan tampilkan error "CredentialsSignin"
          return null
        }
      },
    }),
  ],

  // ─── Callbacks ─────────────────────────────────────────────────────────────
  callbacks: {
    /**
     * jwt: dijalankan saat token dibuat/diperbarui.
     * Persist custom fields ke JWT payload.
     */
    async jwt({ token, user }) {
      if (user) {
        // Saat pertama login, user object tersedia
        token.id = user.id
        token.role = (user as any).role
        token.resellerId = (user as any).resellerId ?? null
        token.resellerSlug = (user as any).resellerSlug ?? null
      }
      return token
    },

    /**
     * session: dijalankan saat useSession() / getServerSession() dipanggil.
     * Expose JWT fields ke session object.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'SUPER_ADMIN' | 'RESELLER'
        session.user.resellerId = (token.resellerId as string | null) ?? null
        session.user.resellerSlug = (token.resellerSlug as string | null) ?? null
      }
      return session
    },
  },

  // ─── Pages ─────────────────────────────────────────────────────────────────
  pages: {
    signIn: '/login',
    error: '/login', // Error query param: /login?error=CredentialsSignin
  },

  // ─── Debug (dev only) ──────────────────────────────────────────────────────
  debug: process.env.NODE_ENV === 'development',
}
