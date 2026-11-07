'use server'

import { getVerifiedSuperAdminId, UNAUTHORIZED } from '@/lib/action-guards'

import { writeFile, mkdir, readdir, stat } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

/**
 * Deteksi tipe gambar dari magic bytes (isi file), BUKAN dari nama file / MIME
 * yang dikirim client — keduanya bisa dipalsukan. Hanya raster image yang diizinkan;
 * SVG/HTML ditolak karena bisa membawa script (stored XSS di origin sendiri).
 */
function detectImageExtension(buf: Buffer): string | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png'
  if (buf.subarray(0, 6).toString('ascii') === 'GIF87a' || buf.subarray(0, 6).toString('ascii') === 'GIF89a') return '.gif'
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return '.webp'
  return null
}

export async function uploadImage(formData: FormData) {
  if (!(await getVerifiedSuperAdminId())) return UNAUTHORIZED
  try {
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return { success: false, error: 'File tidak ditemukan.' }
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return { success: false, error: 'Ukuran file maksimal 5MB.' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = detectImageExtension(buffer)
    if (!ext) {
      return { success: false, error: 'Format file tidak diizinkan. Gunakan JPG, PNG, GIF, atau WEBP.' }
    }

    // Nama file sepenuhnya dibuat server — tidak memakai nama asli dari client
    const filename = `${Date.now()}-${randomUUID()}${ext}`

    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)

    return { success: true, url: `/uploads/${filename}` }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: 'Gagal mengunggah gambar.' }
  }
}

export async function getPublicUploads() {
  if (!(await getVerifiedSuperAdminId())) return UNAUTHORIZED
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
    const files = await readdir(UPLOAD_DIR)

    // Get file stats to sort by newest
    const filesWithStats = await Promise.all(
      files.map(async (filename) => {
        const fileStat = await stat(path.join(UPLOAD_DIR, filename))
        return { url: `/uploads/${filename}`, time: fileStat.mtimeMs }
      })
    )

    filesWithStats.sort((a, b) => b.time - a.time)

    return { success: true, data: filesWithStats.map(f => f.url) }
  } catch (error) {
    console.error('Error reading uploads:', error)
    return { success: false, error: 'Gagal membaca daftar upload.' }
  }
}
