/**
 * APPLICATION LAYER — Use Case
 * Login: Validasi credentials, return AuthUser untuk NextAuth.
 */
import type { IAuthRepository } from '@/core/repositories/auth.repository.interface'
import type { IPasswordService } from '@/application/services/password.service.interface'
import type { AuthOutput, LoginInput } from '@/application/dtos/auth.dto'
import { LoginInputSchema } from '@/application/dtos/auth.dto'
import { InvalidCredentialsError } from '@/core/errors/auth.errors'

export class LoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(input: LoginInput): Promise<AuthOutput> {
    // 1. Validasi input
    const validated = LoginInputSchema.parse(input)

    // 2. Cari user berdasarkan email
    const user = await this.authRepository.findByEmail(validated.email)
    if (!user || !user.password) {
      throw new InvalidCredentialsError()
    }

    // 3. Cek soft delete
    if (user.deletedAt !== null) {
      throw new InvalidCredentialsError()
    }

    // 4. Verifikasi password
    const isValid = await this.passwordService.compare(validated.password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    // 5. Ambil auth user lengkap (dengan reseller info)
    const authUser = await this.authRepository.getAuthUser(user.id)
    if (!authUser) {
      throw new InvalidCredentialsError()
    }

    return authUser
  }
}
