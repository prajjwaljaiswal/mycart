import cartReducer, { addItem, removeItem, clearCart } from './cartSlice';
import { Product } from '../types';

const mockProduct: Product = {
  id: '1',
  name: 'Mock Product',
  description: 'A mock product',
  price: 99.99,
  mrp: 120.00,
  images: ['image1.png'],
  category: 'Electronics',
  inStock: true,
  storeId: 'store1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('cartSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('should handle addItem', () => {
    const initialState = { items: [] };
    const actual = cartReducer(initialState, addItem(mockProduct));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(mockProduct);
  });

  it('should handle removeItem', () => {
    const initialState = { items: [mockProduct] };
    const actual = cartReducer(initialState, removeItem('1'));
    expect(actual.items).toHaveLength(0);
  });

  it('should handle clearCart', () => {
    const initialState = { items: [mockProduct] };
    const actual = cartReducer(initialState, clearCart());
    expect(actual.items).toHaveLength(0);
  });

  it('should persist cart state to local storage', () => {
    const initialState = { items: [] };
    cartReducer(initialState, addItem(mockProduct));
    const storedState = JSON.parse(localStorage.getItem('cart') || 'null');
    expect(storedState).toEqual({ items: [mockProduct] });
  });

  it('should load cart state from local storage', () => {
    localStorage.setItem('cart', JSON.stringify({ items: [mockProduct] }));
    const actual = cartReducer(undefined, { type: 'unknown' });
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(mockProduct);
  });
});