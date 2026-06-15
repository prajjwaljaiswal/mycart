import cartReducer, { addItem, removeItem } from './cartSlice';

const initialState = { items: [] };

describe('cart reducer', () => {
  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('should handle addItem', () => {
    const actual = cartReducer(initialState, addItem({ id: '1', name: 'Test Product', price: 100 }));
    expect(actual.items).toHaveLength(1);
  });

  it('should handle removeItem', () => {
    const addState = { items: [{ id: '1', name: 'Test Product', price: 100 }] };
    const actual = cartReducer(addState, removeItem({ id: '1' }));
    expect(actual.items).toHaveLength(0);
  });
});