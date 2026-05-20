/**
 * APPLICATION LAYER — Service Interface
 * Kontrak untuk password hashing service.
 * Diimplementasikan di infrastructure layer menggunakan bcrypt.
 */
export interface IPasswordService {
  hash(password: string): Promise<string>
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>
}
