/**
 * APPLICATION LAYER — DTOs
 * Data Transfer Objects untuk input/output use cases.
 */
import { z } from 'zod'

// --- Login ---
export const LoginInputSchema = z.object({
  email: z.string().email('Format email tidak valid.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})
export type LoginInput = z.infer<typeof LoginInputSchema>

// --- Register Tenant ---
export const RegisterTenantInputSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().email('Format email tidak valid.'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf kapital.')
    .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka.'),
  businessName: z.string().min(2, 'Nama bisnis minimal 2 karakter.'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter.')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.'),
})
export type RegisterTenantInput = z.infer<typeof RegisterTenantInputSchema>

// --- Output ---
export interface AuthOutput {
  id: string
  name: string
  email: string
  role: string
  tenantId: string | null
  tenantSlug: string | null
}
