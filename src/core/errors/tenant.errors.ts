/**
 * CORE LAYER — Tenant Domain Errors
 */
import { AuthError } from '@/core/errors/auth.errors'

export class TenantAccessDeniedError extends AuthError {
  constructor(message = 'Akses ditolak. Anda tidak memiliki izin ke tenant ini.') {
    super(message, 'TENANT_ACCESS_DENIED', 403)
    this.name = 'TenantAccessDeniedError'
  }
}

export class TenantNotFoundError extends AuthError {
  constructor() {
    super('Tenant tidak ditemukan.', 'TENANT_NOT_FOUND', 404)
    this.name = 'TenantNotFoundError'
  }
}

export class TenantSessionMissingError extends AuthError {
  constructor() {
    super(
      'Session tenant tidak tersedia. Pastikan Anda sudah login.',
      'TENANT_SESSION_MISSING',
      401,
    )
    this.name = 'TenantSessionMissingError'
  }
}

export class CrossTenantAccessError extends AuthError {
  constructor() {
    super(
      'Akses lintas tenant diblokir.',
      'CROSS_TENANT_ACCESS',
      403,
    )
    this.name = 'CrossTenantAccessError'
  }
}
