'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createWedding(data: {
  resellerId: string
  templateId: string
  slug: string
  brideName: string
  groomName: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}) {
  try {
    const template = await prisma.template.findUnique({ where: { id: data.templateId } })
    const customConfig = template?.themeConfig ?? undefined

    const wedding = await prisma.wedding.create({
      data: {
        resellerId: data.resellerId,
        templateId: data.templateId,
        slug: data.slug,
        brideName: data.brideName,
        groomName: data.groomName,
        status: data.status,
        customConfig: customConfig as any
      }
    })
    
    revalidatePath('/admin/invitations')
    return { success: true, data: wedding }
  } catch (error: any) {
    console.error('Error creating wedding:', error)
    return { success: false, error: error.message || 'Failed to create wedding' }
  }
}

export async function updateWedding(id: string, data: {
  resellerId: string
  templateId: string
  slug: string
  brideName: string
  groomName: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}) {
  try {
    const existing = await prisma.wedding.findUnique({ where: { id } })
    let customConfigToSave = undefined
    let shouldUpdateConfig = false
    
    if (existing && existing.templateId !== data.templateId) {
      const template = await prisma.template.findUnique({ where: { id: data.templateId } })
      customConfigToSave = template?.themeConfig ?? undefined
      shouldUpdateConfig = true
    }

    const wedding = await prisma.wedding.update({
      where: { id },
      data: {
        resellerId: data.resellerId,
        templateId: data.templateId,
        slug: data.slug,
        brideName: data.brideName,
        groomName: data.groomName,
        status: data.status,
        ...(shouldUpdateConfig ? { customConfig: customConfigToSave as any } : {})
      }
    })
    
    revalidatePath('/admin/invitations')
    return { success: true, data: wedding }
  } catch (error: any) {
    console.error('Error updating wedding:', error)
    return { success: false, error: error.message || 'Failed to update wedding' }
  }
}

export async function deleteWedding(id: string) {
  try {
    await prisma.wedding.delete({
      where: { id }
    })
    
    revalidatePath('/admin/invitations')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting wedding:', error)
    return { success: false, error: error.message || 'Failed to delete wedding' }
  }
}

export async function saveWeddingDesign(id: string, customConfig: any) {
  try {
    const wedding = await prisma.wedding.update({
      where: { id },
      data: {
        customConfig
      }
    })
    
    revalidatePath(`/admin/invitations/${id}/design`)
    revalidatePath('/admin/invitations')
    
    return { success: true, data: wedding }
  } catch (error: any) {
    console.error('Error saving wedding design:', error)
    return { success: false, error: error.message || 'Failed to save design' }
  }
}

export async function updateWeddingStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
  try {
    const wedding = await prisma.wedding.update({
      where: { id },
      data: { status }
    })
    
    revalidatePath(`/admin/invitations/${id}/design`)
    revalidatePath('/admin/invitations')
    
    return { success: true, data: wedding }
  } catch (error: any) {
    console.error('Error updating wedding status:', error)
    return { success: false, error: error.message || 'Failed to update status' }
  }
}
