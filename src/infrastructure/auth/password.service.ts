/**
 * INFRASTRUCTURE LAYER — Service Implementation
 * Password hashing menggunakan bcryptjs.
 */
import bcrypt from 'bcryptjs'
import type { IPasswordService } from '@/application/services/password.service.interface'

const SALT_ROUNDS = 12 // Cost factor — lebih tinggi = lebih aman tapi lebih lambat

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

// Singleton — export langsung untuk digunakan di authOptions
export const passwordService = new BcryptPasswordService()
