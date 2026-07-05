/**
 * Next.js Middleware — Auth + Subdomain Routing
 *
 * Dua tanggung jawab:
 * 1. Auth Guard: Proteksi /admin/* dan /dashboard/* dari akses tanpa login
 * 2. Subdomain Routing: Rewrite tenant.aaprintech.com → /tenant/[subdomain]
 *
 * CATATAN PENTING (NextAuth v4 di Middleware):
 * Middleware berjalan di Edge Runtime — tidak bisa import authOptions langsung
 * karena bcrypt tidak kompatibel dengan Edge. Solusi: decode JWT secara manual
 * menggunakan getToken() dari next-auth/jwt yang ringan dan Edge-compatible.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Route yang wajib login
const PROTECTED_PREFIXES = ['/admin', '/dashboard']

// Route yang hanya boleh diakses SUPER_ADMIN
const SUPER_ADMIN_ONLY = ['/admin']

export async function middleware(request: NextRequest) {
  const { nextUrl, headers } = request
  const hostname = headers.get('host') || ''
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aaprintech.com'
  const isLocalhost = hostname === 'localhost:3000' || hostname.endsWith('.localhost:3000')

  // ─── 1. Subdomain Detection ───────────────────────────────────────────────
  const isRootDomain =
    hostname === mainDomain ||
    hostname === `www.${mainDomain}` ||
    hostname === 'localhost:3000'

  if (!isRootDomain && !isLocalhost) {
    // Subdomain request: reseller.aaprintech.com → /reseller/[subdomain]
    const subdomain = hostname.split('.')[0]
    const rewriteUrl = new URL(`/reseller/${subdomain}${nextUrl.pathname}`, request.url)
    return NextResponse.rewrite(rewriteUrl)
  }

  // ─── 2. Auth Guard ────────────────────────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) => nextUrl.pathname.startsWith(prefix))

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Belum login → redirect ke /login dengan callbackUrl
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Cek SUPER_ADMIN only routes
    const isSuperAdminRoute = SUPER_ADMIN_ONLY.some((prefix) =>
      nextUrl.pathname.startsWith(prefix),
    )
    if (isSuperAdminRoute && token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // ─── 3. Redirect jika sudah login mengakses /login ────────────────────────
  if (nextUrl.pathname === '/login') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (token) {
      const dest = token.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * - _next/static, _next/image (Next.js assets)
     * - favicon.ico
     * - api/auth (NextAuth handler — jangan diproteksi middleware)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
