'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabaseServerClient, BUCKET_NAME } from '@/infrastructure/storage/supabase'
import { unlink } from 'fs/promises'
import path from 'path'

export async function deleteMediaGlobal(mediaId: string) {
  try {
    if (mediaId.startsWith('local-')) {
      const filename = mediaId.replace('local-', '')
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await unlink(filepath)
      revalidatePath('/admin/media')
      return { success: true }
    }
    const media = await (prisma as any).media.findUnique({
      where: { id: mediaId }
    })
    
    if (!media) return { success: false, error: 'Media tidak ditemukan.' }

    // Hapus dari Supabase Storage jika provider adalah supabase
    if (media.provider === 'supabase') {
      const urlParts = media.fileUrl.split(`/public/${BUCKET_NAME}/`)
      if (urlParts.length === 2) {
        const storagePath = urlParts[1]
        await supabaseServerClient.storage.from(BUCKET_NAME).remove([storagePath])
      }
    }

    // Hapus dari Prisma
    await (prisma as any).media.delete({ where: { id: mediaId } })

    revalidatePath('/admin/media')
    return { success: true }
  } catch (err: any) {
    console.error('Delete Media Global Error:', err)
    return { success: false, error: 'Terjadi kesalahan sistem saat menghapus media.' }
  }
}

import { v4 as uuidv4 } from 'uuid'

export async function uploadGlobalMediaAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null
    const tenantId = formData.get('tenantId') as string | null

    if (!file) return { success: false, error: 'File tidak ditemukan.' }
    if (!tenantId) return { success: false, error: 'Tenant tidak dipilih.' }
    
    if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Ukuran file maksimal 5MB.' }

    const tenant = await (prisma as any).tenant.findUnique({ where: { id: tenantId }, select: { slug: true } })
    if (!tenant) return { success: false, error: 'Tenant tidak ditemukan.' }

    const ext = path.extname(file.name) || (file.type === 'image/webp' ? '.webp' : '.jpg')
    const randomName = uuidv4()
    
    // Path: tenantSlug/global/random.webp
    const storagePath = `${tenant.slug}/global/${randomName}${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    
    const { error: uploadError } = await supabaseServerClient
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

    const { data: { publicUrl } } = supabaseServerClient
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    await (prisma as any).media.create({
      data: {
        tenantId,
        provider: 'supabase',
        fileUrl: publicUrl,
        fileType: file.type,
        size: file.size,
      }
    })

    revalidatePath('/admin/media')
    return { success: true }
  } catch (err: any) {
    console.error('Upload Global Error:', err)
    return { success: false, error: 'Terjadi kesalahan sistem saat mengunggah media.' }
  }
}
