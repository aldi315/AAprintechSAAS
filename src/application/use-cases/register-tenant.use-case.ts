/**
 * APPLICATION LAYER — Use Case
 * Register Tenant: Buat user + tenant sekaligus.
 *
 * Tidak ada import Prisma di sini — infrastructure detail disembunyikan
 * sepenuhnya di balik IAuthRepository. Use case ini hanya tahu:
 *   1. Validasi input
 *   2. Cek email unik
 *   3. Hash password
 *   4. Delegasikan pembuatan data ke repository
 */
import type { IAuthRepository } from '@/core/repositories/auth.repository.interface'
import type { IPasswordService } from '@/application/services/password.service.interface'
import type { RegisterTenantInput, AuthOutput } from '@/application/dtos/auth.dto'
import { RegisterTenantInputSchema } from '@/application/dtos/auth.dto'
import { EmailAlreadyTakenError } from '@/core/errors/auth.errors'

export class RegisterTenantUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(input: RegisterTenantInput): Promise<AuthOutput> {
    // 1. Validasi input dengan Zod
    const validated = RegisterTenantInputSchema.parse(input)

    // 2. Cek apakah email sudah terdaftar
    const isTaken = await this.authRepository.isEmailTaken(validated.email)
    if (isTaken) {
      throw new EmailAlreadyTakenError()
    }

    // 3. Hash password — delegasi ke IPasswordService
    const hashedPassword = await this.passwordService.hash(validated.password)

    // 4. Buat User + Tenant via repository
    //    Prisma $transaction tersembunyi di infrastructure — use case tidak tahu
    const { userId, tenantId, tenantSlug } = await this.authRepository.createUserWithTenant({
      name: validated.name,
      email: validated.email,
      hashedPassword,
      businessName: validated.businessName,
      slug: validated.slug,
    })

    // 5. Ambil AuthUser untuk response (nama, email, role lengkap)
    const authUser = await this.authRepository.getAuthUser(userId)

    return {
      id: userId,
      name: authUser?.name ?? validated.name,
      email: authUser?.email ?? validated.email,
      role: authUser?.role ?? 'TENANT',
      tenantId,
      tenantSlug,
    }
  }
}
