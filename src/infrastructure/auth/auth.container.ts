/**
 * INFRASTRUCTURE LAYER — Dependency Container (Factory)
 * Menyatukan semua dependency injections untuk auth module.
 * Import dari sini, bukan langsung dari masing-masing file.
 */
import { LoginUseCase } from '@/application/use-cases/login.use-case'
import { RegisterTenantUseCase } from '@/application/use-cases/register-tenant.use-case'
import { authRepository } from '@/infrastructure/repositories/auth.repository'
import { passwordService } from '@/infrastructure/auth/password.service'

// Singleton use cases — aman untuk Server Components & Server Actions
export const loginUseCase = new LoginUseCase(authRepository, passwordService)
export const registerTenantUseCase = new RegisterTenantUseCase(authRepository, passwordService)
