// src/products/ProductList.spec.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from './ProductList';
import * as ProductService from './ProductService';

jest.mock('./ProductService');

const mockProducts = [
  { id: '1', name: 'Product 1', price: 10 },
  { id: '2', name: 'Product 2', price: 20 }
];

describe('ProductList', () => {
  it('renders products successfully', async () => {
    ProductService.fetchProducts.mockResolvedValue(mockProducts);
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product 1 - $10')).toBeInTheDocument();
      expect(screen.getByText('Product 2 - $20')).toBeInTheDocument();
    });
  });

  it('renders error message on fetch failure', async () => {
    ProductService.fetchProducts.mockRejectedValue(new Error('Failed to fetch products'));
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch products')).toBeInTheDocument();
    });
  });
});