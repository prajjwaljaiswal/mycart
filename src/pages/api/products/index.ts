import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, priceMin, priceMax, sortBy, sortOrder } = req.query;

    try {
        const products = await prisma.product.findMany({
            where: {
                category: category ? String(category) : undefined,
                price: {
                    gte: priceMin ? Number(priceMin) : undefined,
                    lte: priceMax ? Number(priceMax) : undefined,
                },
                inStock: true
            },
            orderBy: sortBy ? {
                [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
            } : undefined,
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}