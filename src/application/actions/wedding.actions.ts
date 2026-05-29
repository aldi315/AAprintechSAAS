'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createWedding(data: {
  tenantId: string
  templateId: string
  slug: string
  brideName: string
  groomName: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}) {
  try {
    const wedding = await prisma.wedding.create({
      data: {
        tenantId: data.tenantId,
        templateId: data.templateId,
        slug: data.slug,
        brideName: data.brideName,
        groomName: data.groomName,
        status: data.status,
      }
    })
    
    revalidatePath('/admin/weddings')
    return { success: true, data: wedding }
  } catch (error: any) {
    console.error('Error creating wedding:', error)
    return { success: false, error: error.message || 'Failed to create wedding' }
  }
}

export async function updateWedding(id: string, data: {
  tenantId: string
  templateId: string
  slug: string
  brideName: string
  groomName: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}) {
  try {
    const wedding = await prisma.wedding.update({
      where: { id },
      data: {
        tenantId: data.tenantId,
        templateId: data.templateId,
        slug: data.slug,
        brideName: data.brideName,
        groomName: data.groomName,
        status: data.status,
      }
    })
    
    revalidatePath('/admin/weddings')
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
    
    revalidatePath('/admin/weddings')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting wedding:', error)
    return { success: false, error: error.message || 'Failed to delete wedding' }
  }
}
