/**
 * CORE LAYER — Custom Errors
 * Domain-level errors yang dilempar oleh use cases.
 */

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 401,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Email atau password salah.', 'INVALID_CREDENTIALS', 401)
    this.name = 'InvalidCredentialsError'
  }
}

export class EmailAlreadyTakenError extends AuthError {
  constructor() {
    super('Email sudah terdaftar. Gunakan email lain.', 'EMAIL_TAKEN', 409)
    this.name = 'EmailAlreadyTakenError'
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super('User tidak ditemukan.', 'USER_NOT_FOUND', 404)
    this.name = 'UserNotFoundError'
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Anda tidak memiliki akses ke halaman ini.') {
    super(message, 'UNAUTHORIZED', 403)
    this.name = 'UnauthorizedError'
  }
}
