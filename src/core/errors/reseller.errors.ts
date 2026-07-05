/**
 * CORE LAYER — Reseller Domain Errors
 */
import { AuthError } from '@/core/errors/auth.errors'

export class ResellerAccessDeniedError extends AuthError {
  constructor(message = 'Akses ditolak. Anda tidak memiliki izin ke reseller ini.') {
    super(message, 'RESELLER_ACCESS_DENIED', 403)
    this.name = 'ResellerAccessDeniedError'
  }
}

export class ResellerNotFoundError extends AuthError {
  constructor() {
    super('Reseller tidak ditemukan.', 'RESELLER_NOT_FOUND', 404)
    this.name = 'ResellerNotFoundError'
  }
}

export class ResellerSessionMissingError extends AuthError {
  constructor() {
    super(
      'Session reseller tidak tersedia. Pastikan Anda sudah login.',
      'RESELLER_SESSION_MISSING',
      401,
    )
    this.name = 'ResellerSessionMissingError'
  }
}

export class CrossResellerAccessError extends AuthError {
  constructor() {
    super(
      'Akses lintas reseller diblokir.',
      'CROSS_RESELLER_ACCESS',
      403,
    )
    this.name = 'CrossResellerAccessError'
  }
}
