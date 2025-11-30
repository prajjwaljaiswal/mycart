import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Fetch all addresses for the authenticated user
        const addresses = await prisma.address.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                addresses: addresses 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error fetching addresses:', error)
        return NextResponse.json(
            { error: 'Failed to fetch addresses', details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, email, street, city, state, zip, country, phone } = body

        // Validate required fields
        if (!name || !email || !street || !city || !state || !zip || !country || !phone) {
            return NextResponse.json(
                { error: 'All address fields are required' },
                { status: 400 }
            )
        }

        // Ensure user exists in database (create if doesn't exist)
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            // User should be created by webhook, but if not, we need to get their info from Clerk
            const { currentUser } = await import('@clerk/nextjs/server')
            const clerkUser = await currentUser()
            
            if (!clerkUser) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                )
            }

            await prisma.user.create({
                data: {
                    id: userId,
                    name: clerkUser.firstName && clerkUser.lastName 
                        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
                        : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || 'User',
                    email: clerkUser.emailAddresses[0]?.emailAddress || email,
                    image: clerkUser.imageUrl || '',
                    cart: {}
                }
            })
        }

        // Create address
        const address = await prisma.address.create({
            data: {
                userId: userId,
                name,
                email,
                street,
                city,
                state,
                zip,
                country,
                phone
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                address: address 
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating address:', error)
        return NextResponse.json(
            { error: 'Failed to create address', details: error.message },
            { status: 500 }
        )
    }
}

