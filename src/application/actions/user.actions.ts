'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(data: {
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'TENANT'
}) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role
      }
    })
    
    revalidatePath('/admin/users')
    return { success: true, data: user }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return { success: false, error: error.message || 'Failed to create user' }
  }
}

export async function updateUser(id: string, data: {
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'TENANT'
}) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role
      }
    })
    
    revalidatePath('/admin/users')
    return { success: true, data: user }
  } catch (error: any) {
    console.error('Error updating user:', error)
    return { success: false, error: error.message || 'Failed to update user' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    })
    
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting user:', error)
    if (error.code === 'P2003') {
      return { success: false, error: 'Gagal menghapus: User ini memiliki Tenant yang masih aktif.' }
    }
    return { success: false, error: error.message || 'Failed to delete user' }
  }
}
