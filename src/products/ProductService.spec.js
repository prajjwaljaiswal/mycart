// src/products/ProductService.spec.js
import { fetchProducts } from './ProductService';
import axios from 'axios';

jest.mock('axios');

describe('ProductService', () => {
  it('fetches products successfully', async () => {
    const products = [{ id: '1', name: 'Product 1', price: 10 }];
    axios.get.mockResolvedValue({ data: products });

    await expect(fetchProducts()).resolves.toEqual(products);
  });

  it('throws an error when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch products'));

    await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
  });
});