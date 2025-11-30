import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
      return null
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, SECRET)

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId }
    })

    if (!admin) {
      return null
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name
    }
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return null
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession()
  
  if (!admin) {
    throw new Error('Unauthorized - Admin access required')
  }

  return admin
}

