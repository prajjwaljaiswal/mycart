import { auth, currentUser } from '@clerk/nextjs/server'
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

        // Get user from Clerk
        const clerkUser = await currentUser()

        if (!clerkUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user exists in database, if not create them
        let user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                Address: true,
                buyerOrders: {
                    include: {
                        orderItems: {
                            include: {
                                product: true
                            }
                        },
                        address: true,
                        store: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5 // Get latest 5 orders
                }
            }
        })

        // If user doesn't exist in database, create them
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    name: clerkUser.firstName && clerkUser.lastName 
                        ? `${clerkUser.firstName} ${clerkUser.lastName}` 
                        : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || 'User',
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    image: clerkUser.imageUrl || '',
                    cart: {}
                },
                include: {
                    Address: true,
                    buyerOrders: true
                }
            })
        } else {
            // Update user info from Clerk if it has changed
            const updatedName = clerkUser.firstName && clerkUser.lastName 
                ? `${clerkUser.firstName} ${clerkUser.lastName}` 
                : clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress || user.name
            const updatedEmail = clerkUser.emailAddresses[0]?.emailAddress || user.email
            const updatedImage = clerkUser.imageUrl || user.image

            if (user.name !== updatedName || user.email !== updatedEmail || user.image !== updatedImage) {
                user = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        name: updatedName,
                        email: updatedEmail,
                        image: updatedImage
                    },
                    include: {
                        Address: true,
                        buyerOrders: {
                            include: {
                                orderItems: {
                                    include: {
                                        product: true
                                    }
                                },
                                address: true,
                                store: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 5
                        }
                    }
                })
            }
        }

        return NextResponse.json(
            { 
                success: true, 
                user: user 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user', details: error.message },
            { status: 500 }
        )
    }
}

export async function PUT(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, email, image, cart } = body

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(image && { image }),
                ...(cart !== undefined && { cart })
            },
            include: {
                Address: true
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                user: updatedUser 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Failed to update user', details: error.message },
            { status: 500 }
        )
    }
}

