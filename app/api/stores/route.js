import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch store status for current user
export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Fetch store for the authenticated user
        const store = await prisma.store.findUnique({
            where: {
                userId: userId
            }
        })

        if (!store) {
            return NextResponse.json(
                { 
                    success: true, 
                    hasStore: false 
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { 
                success: true, 
                hasStore: true,
                store: store 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error fetching store:', error)
        return NextResponse.json(
            { error: 'Failed to fetch store', details: error.message },
            { status: 500 }
        )
    }
}

// POST - Create a new store
export async function POST(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if user already has a store
        const existingStore = await prisma.store.findUnique({
            where: { userId: userId }
        })

        if (existingStore) {
            return NextResponse.json(
                { error: 'You already have a store. Only one store per user is allowed.' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { name, username, description, email, contact, address, logo } = body

        // Validate required fields
        if (!name || !username || !description || !email || !contact || !address) {
            return NextResponse.json(
                { error: 'All fields except logo are required' },
                { status: 400 }
            )
        }

        // Validate username format (alphanumeric, hyphens, underscores)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                { error: 'Username can only contain letters, numbers, hyphens, and underscores' },
                { status: 400 }
            )
        }

        // Check if username is already taken
        const usernameTaken = await prisma.store.findUnique({
            where: { username: username }
        })

        if (usernameTaken) {
            return NextResponse.json(
                { error: 'Username is already taken. Please choose a different one.' },
                { status: 400 }
            )
        }

        // Ensure user exists in database
        let user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            // Get user info from Clerk
            const clerkUser = await currentUser()
            
            if (!clerkUser) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                )
            }

            user = await prisma.user.create({
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

        // Create store
        const store = await prisma.store.create({
            data: {
                userId: userId,
                name,
                username: username.toLowerCase(), // Store username in lowercase
                description,
                email,
                contact,
                address,
                logo: logo || '', // Store logo URL or empty string
                status: 'pending', // Store needs admin approval
                isActive: false // Not active until approved
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                store: store,
                message: 'Store created successfully! It will be activated after admin approval.' 
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating store:', error)
        return NextResponse.json(
            { error: 'Failed to create store', details: error.message },
            { status: 500 }
        )
    }
}

