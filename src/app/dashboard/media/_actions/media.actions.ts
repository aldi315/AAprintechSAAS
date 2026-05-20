'use server'

import { z } from 'zod'
import { requireTenant } from '@/lib/tenant-guard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabaseServerClient, BUCKET_NAME } from '@/infrastructure/storage/supabase'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ActionResult { success: boolean; error?: string }

export async function uploadMediaAction(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireTenant()
    const file = formData.get('file') as File | null
    const weddingId = formData.get('weddingId') as string | null

    if (!file) return { success: false, error: 'File tidak ditemukan.' }
    if (!weddingId) return { success: false, error: 'Wedding tidak dipilih.' }
    
    if (file.size > MAX_FILE_SIZE) return { success: false, error: 'Ukuran file maksimal 5MB.' }
    if (!ALLOWED_TYPES.includes(file.type)) return { success: false, error: 'Format file tidak diizinkan. Gunakan JPG, PNG, atau WEBP.' }

    // Get Tenant Slug and Wedding Slug
    const [tenant, wedding] = await Promise.all([
      (prisma as any).tenant.findUnique({ where: { id: ctx.tenantId }, select: { slug: true } }),
      (prisma as any).wedding.findFirst({ where: { id: weddingId, tenantId: ctx.tenantId }, select: { slug: true } })
    ])

    if (!tenant) return { success: false, error: 'Tenant tidak ditemukan.' }
    if (!wedding) return { success: false, error: 'Wedding tidak ditemukan atau tidak berhak diakses.' }

    const ext = path.extname(file.name) || (file.type === 'image/webp' ? '.webp' : '.jpg')
    const randomName = uuidv4()
    
    // Path: tenantSlug/weddingSlug/gallery/random.webp
    const storagePath = `${tenant.slug}/${wedding.slug}/gallery/${randomName}${ext}`

    // Upload to Supabase
    const buffer = Buffer.from(await file.arrayBuffer())
    
    const { data: uploadData, error: uploadError } = await supabaseServerClient
      .storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError)
      return { success: false, error: 'Gagal mengunggah file ke storage.' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseServerClient
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    // Save to Prisma
    await (prisma as any).media.create({
      data: {
        tenantId: ctx.tenantId,
        weddingId: weddingId,
        provider: 'supabase',
        fileUrl: publicUrl,
        fileType: file.type,
        size: file.size,
      }
    })

    revalidatePath('/dashboard/media')
    return { success: true }
  } catch (err: any) {
    console.error('Upload Error:', err)
    return { success: false, error: 'Terjadi kesalahan sistem saat mengunggah media.' }
  }
}

export async function deleteMediaAction(mediaId: string): Promise<ActionResult> {
  try {
    const ctx = await requireTenant()
    
    const media = await (prisma as any).media.findFirst({
      where: { id: mediaId, tenantId: ctx.tenantId }
    })
    
    if (!media) return { success: false, error: 'Media tidak ditemukan.' }

    // Parse path from fileUrl
    // Format URL Supabase public: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const urlParts = media.fileUrl.split(`/public/${BUCKET_NAME}/`)
    if (urlParts.length === 2 && media.provider === 'supabase') {
      const storagePath = urlParts[1]
      
      const { error: deleteError } = await supabaseServerClient
        .storage
        .from(BUCKET_NAME)
        .remove([storagePath])
        
      if (deleteError) {
        console.error('Supabase Delete Error:', deleteError)
        return { success: false, error: 'Gagal menghapus file di storage.' }
      }
    }

    // Hapus dari Prisma
    await (prisma as any).media.delete({ where: { id: mediaId } })

    revalidatePath('/dashboard/media')
    return { success: true }
  } catch (err: any) {
    console.error('Delete Media Error:', err)
    return { success: false, error: 'Terjadi kesalahan sistem saat menghapus media.' }
  }
}
