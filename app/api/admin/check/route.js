import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { isAdmin: false, error: 'Not authenticated' },
                { status: 401 }
            )
        }

        // Check if user has admin role in Clerk metadata
        const clerkUser = await clerkClient.users.getUser(userId)
        const userRole = clerkUser.publicMetadata?.role || 'buyer'

        return NextResponse.json(
            { 
                isAdmin: userRole === 'admin',
                role: userRole
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

