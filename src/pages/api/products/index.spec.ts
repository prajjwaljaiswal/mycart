import handler from './index';
import { createMocks } from 'node-mocks-http';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
        },
    },
}));

describe('GET /api/products', () => {
    it('returns products based on filters and sorting', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { category: 'electronics', priceMin: '10', priceMax: '1000', sortBy: 'price', sortOrder: 'asc' },
        });

        const mockProducts = [{ id: '1', name: 'Product 1', price: 100 }, { id: '2', name: 'Product 2', price: 200 }];
        (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockProducts);
    });
});