/**
 * APPLICATION LAYER — Use Case
 * Register Reseller: Buat user + reseller sekaligus.
 */
import type { IAuthRepository } from '@/core/repositories/auth.repository.interface'
import type { IPasswordService } from '@/application/services/password.service.interface'
import type { RegisterResellerInput, AuthOutput } from '@/application/dtos/auth.dto'
import { RegisterResellerInputSchema } from '@/application/dtos/auth.dto'
import { EmailAlreadyTakenError } from '@/core/errors/auth.errors'

export class RegisterResellerUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(input: RegisterResellerInput): Promise<AuthOutput> {
    const validated = RegisterResellerInputSchema.parse(input)

    const isTaken = await this.authRepository.isEmailTaken(validated.email)
    if (isTaken) {
      throw new EmailAlreadyTakenError()
    }

    const hashedPassword = await this.passwordService.hash(validated.password)

    const { userId, resellerId, resellerSlug } = await this.authRepository.createUserWithReseller({
      name: validated.name,
      email: validated.email,
      hashedPassword,
      businessName: validated.businessName,
      slug: validated.slug,
    })

    const authUser = await this.authRepository.getAuthUser(userId)

    return {
      id: userId,
      name: authUser?.name ?? validated.name,
      email: authUser?.email ?? validated.email,
      role: authUser?.role ?? 'RESELLER',
      resellerId,
      resellerSlug,
    }
  }
}
