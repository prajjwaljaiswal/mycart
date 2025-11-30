import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

// GET - Fetch all stores for admin review
export async function GET(request) {
    try {
        // Check if user is admin using database session
        const admin = await getAdminSession()

        if (!admin) {
            return NextResponse.json(
                { error: 'Forbidden. Admin access required.' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // pending, approved, rejected

        const where = status ? { status: status } : {}

        const stores = await prisma.store.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                stores: stores 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error fetching stores:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stores', details: error.message },
            { status: 500 }
        )
    }
}

// PATCH - Update store status (approve/reject)
export async function PATCH(request) {
    try {
        // Check if user is admin using database session
        const admin = await getAdminSession()

        if (!admin) {
            return NextResponse.json(
                { error: 'Forbidden. Admin access required.' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { storeId, status } = body

        if (!storeId || !status) {
            return NextResponse.json(
                { error: 'storeId and status are required' },
                { status: 400 }
            )
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be pending, approved, or rejected' },
                { status: 400 }
            )
        }

        // Update store status
        const store = await prisma.store.update({
            where: { id: storeId },
            data: {
                status: status,
                isActive: status === 'approved'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        })

        // Note: Seller role assignment in Clerk is handled separately
        // Store approval automatically enables seller functionality through database status

        return NextResponse.json(
            { 
                success: true, 
                store: store,
                message: `Store ${status} successfully` 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error updating store status:', error)
        return NextResponse.json(
            { error: 'Failed to update store status', details: error.message },
            { status: 500 }
        )
    }
}

