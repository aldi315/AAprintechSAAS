'use server'

import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    // Buat nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const filename = `${uniqueSuffix}-${originalName}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Pastikan direktori ada
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // ignore error if exists
    }

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return { success: true, url: `/uploads/${filename}` }
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return { success: false, error: error.message || 'Failed to upload image' }
  }
}

import { readdir, stat } from 'fs/promises'

export async function getPublicUploads() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Ensure dir exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {}

    const files = await readdir(uploadDir)
    
    // Get file stats to sort by newest
    const filesWithStats = await Promise.all(
      files.map(async (filename) => {
        const filepath = path.join(uploadDir, filename)
        const fileStat = await stat(filepath)
        return {
          url: `/uploads/${filename}`,
          name: filename,
          time: fileStat.mtimeMs
        }
      })
    )

    // Sort descending by time
    filesWithStats.sort((a, b) => b.time - a.time)

    return { success: true, data: filesWithStats.map(f => f.url) }
  } catch (error: any) {
    console.error('Error reading uploads:', error)
    return { success: false, error: error.message || 'Failed to read uploads' }
  }
}
