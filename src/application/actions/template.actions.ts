'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTemplate(data: {
  name: string
  categoryId: string
  previewImage: string
  price: number
  active: boolean
}) {
  try {
    const template = await prisma.template.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        previewImage: data.previewImage || null,
        price: data.price || 0,
        active: data.active,
        themeConfig: {} // Default empty JSON for now
      }
    })
    
    revalidatePath('/admin/templates')
    return { success: true, data: template }
  } catch (error: any) {
    console.error('Error creating template:', error)
    return { success: false, error: error.message || 'Failed to create template' }
  }
}

export async function updateTemplate(id: string, data: {
  name: string
  categoryId: string
  previewImage: string
  price: number
  active: boolean
}) {
  try {
    const template = await prisma.template.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
        previewImage: data.previewImage || null,
        price: data.price || 0,
        active: data.active
      }
    })
    
    revalidatePath('/admin/templates')
    return { success: true, data: template }
  } catch (error: any) {
    console.error('Error updating template:', error)
    return { success: false, error: error.message || 'Failed to update template' }
  }
}

export async function deleteTemplate(id: string) {
  try {
    await prisma.template.delete({
      where: { id }
    })
    
    revalidatePath('/admin/templates')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting template:', error)
    if (error.code === 'P2003') {
      return { success: false, error: 'Gagal menghapus: Template ini sedang digunakan oleh data Undangan.' }
    }
    return { success: false, error: error.message || 'Failed to delete template' }
  }
}

export async function saveTemplateDesign(id: string, themeConfig: any) {
  try {
    const template = await prisma.template.update({
      where: { id },
      data: { themeConfig }
    })
    
    revalidatePath(`/admin/templates/${id}/design`)
    revalidatePath('/admin/templates')
    return { success: true, data: template }
  } catch (error: any) {
    console.error('Error saving template design:', error)
    return { success: false, error: error.message || 'Failed to save template design' }
  }
}
