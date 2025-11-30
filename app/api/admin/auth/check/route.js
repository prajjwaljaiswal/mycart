import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
    try {
        const admin = await getAdminSession()

        if (!admin) {
            return NextResponse.json(
                { isAdmin: false, error: 'Not authenticated' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { 
                isAdmin: true,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name
                }
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error checking admin status:', error)
        return NextResponse.json(
            { isAdmin: false, error: 'Failed to check admin status' },
            { status: 500 }
        )
    }
}

