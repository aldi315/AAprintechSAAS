'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: { name: string, slug: string }) {
  try {
    const category = await prisma.templateCategory.create({
      data
    })
    revalidatePath('/admin/templates')
    revalidatePath('/admin/templates/categories')
    return { success: true, data: category }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return { success: false, error: error.message || 'Failed to create category' }
  }
}

export async function updateCategory(id: string, data: { name: string, slug: string }) {
  try {
    const category = await prisma.templateCategory.update({
      where: { id },
      data
    })
    revalidatePath('/admin/templates')
    revalidatePath('/admin/templates/categories')
    return { success: true, data: category }
  } catch (error: any) {
    console.error('Error updating category:', error)
    return { success: false, error: error.message || 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.templateCategory.delete({
      where: { id }
    })
    revalidatePath('/admin/templates')
    revalidatePath('/admin/templates/categories')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message || 'Failed to delete category (Pastikan tidak ada template yang terhubung)' }
  }
}
