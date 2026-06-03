// src/products/ProductService.js
import axios from 'axios';

export const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};