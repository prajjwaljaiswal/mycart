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

        // Fetch all orders for the authenticated user
        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
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
            }
        })

        return NextResponse.json(
            { 
                success: true, 
                orders: orders 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders', details: error.message },
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
        const { items, addressId, addressData, paymentMethod, coupon, total } = body

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            )
        }

        if (!paymentMethod) {
            return NextResponse.json(
                { error: 'Payment method is required' },
                { status: 400 }
            )
        }

        // Handle address - either use existing addressId or create new address from addressData
        let finalAddressId = addressId
        let address

        if (addressId) {
            // Verify address belongs to user
            address = await prisma.address.findFirst({
                where: {
                    id: addressId,
                    userId: userId
                }
            })

            if (!address) {
                return NextResponse.json(
                    { error: 'Invalid address' },
                    { status: 400 }
                )
            }
        } else if (addressData) {
            // Create new address if addressData is provided
            try {
                address = await prisma.address.create({
                    data: {
                        userId: userId,
                        name: addressData.name,
                        email: addressData.email,
                        street: addressData.street,
                        city: addressData.city,
                        state: addressData.state,
                        zip: addressData.zip,
                        country: addressData.country,
                        phone: addressData.phone
                    }
                })
                finalAddressId = address.id
            } catch (error) {
                return NextResponse.json(
                    { error: 'Failed to create address', details: error.message },
                    { status: 400 }
                )
            }
        } else {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            )
        }

        // Fetch products from database to get correct storeId for each item
        const productIds = items.map(item => item.id)
        
        if (!productIds || productIds.length === 0) {
            return NextResponse.json(
                { error: 'No products found in order' },
                { status: 400 }
            )
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        isActive: true
                    }
                }
            }
        })

        // Create a map of productId to product for quick lookup
        const productMap = new Map()
        products.forEach(product => {
            productMap.set(product.id, product)
        })

        // Verify all products exist and build items with correct storeId
        const validatedItems = []
        for (const item of items) {
            const product = productMap.get(item.id)
            
            if (!product) {
                return NextResponse.json(
                    { error: `Product with id ${item.id} not found` },
                    { status: 400 }
                )
            }

            if (!product.store) {
                return NextResponse.json(
                    { error: `Store not found for product ${product.name}` },
                    { status: 400 }
                )
            }

            // Validate product is in stock
            if (!product.inStock) {
                return NextResponse.json(
                    { error: `Product ${product.name} is out of stock` },
                    { status: 400 }
                )
            }

            // Use database price for security (prevent price manipulation)
            validatedItems.push({
                ...item,
                storeId: product.storeId,
                price: product.price // Use price from database, not from client
            })
        }

        // Group items by storeId (each order belongs to one store)
        const itemsByStore = {}
        for (const item of validatedItems) {
            const storeId = item.storeId
            if (!itemsByStore[storeId]) {
                itemsByStore[storeId] = []
            }
            itemsByStore[storeId].push(item)
        }

        // Create orders for each store
        const createdOrders = []
        for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
            // Verify store exists
            const store = await prisma.store.findUnique({
                where: { id: storeId }
            })

            if (!store) {
                return NextResponse.json(
                    { error: `Store with id ${storeId} not found` },
                    { status: 400 }
                )
            }

            // Calculate total for this store's items
            const storeTotal = storeItems.reduce((sum, item) => {
                return sum + (item.price * item.quantity)
            }, 0)

            // Apply coupon discount if applicable
            let finalTotal = storeTotal
            let isCouponUsed = false
            let couponData = {}

            if (coupon && coupon.code) {
                // Verify coupon
                const couponRecord = await prisma.coupon.findUnique({
                    where: { code: coupon.code.toUpperCase() }
                })

                if (couponRecord && new Date(couponRecord.expiresAt) > new Date()) {
                    const discount = (couponRecord.discount / 100) * storeTotal
                    finalTotal = storeTotal - discount
                    isCouponUsed = true
                    couponData = {
                        code: couponRecord.code,
                        discount: couponRecord.discount,
                        description: couponRecord.description
                    }
                }
            }

            // Create order
            const order = await prisma.order.create({
                data: {
                    userId,
                    storeId,
                    addressId: finalAddressId,
                    total: finalTotal,
                    paymentMethod: paymentMethod.toUpperCase(),
                    isPaid: paymentMethod.toUpperCase() === 'STRIPE', // Assuming Stripe payments are paid immediately
                    isCouponUsed,
                    coupon: couponData,
                    orderItems: {
                        create: storeItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    address: true,
                    store: true
                }
            })

            createdOrders.push(order)
        }

        return NextResponse.json(
            { 
                success: true, 
                orders: createdOrders,
                message: 'Order placed successfully' 
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error placing order:', error)
        return NextResponse.json(
            { error: 'Failed to place order', details: error.message },
            { status: 500 }
        )
    }
}

