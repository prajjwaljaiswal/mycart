import cartReducer, { addItem, removeItem, updateQuantity, updateTotalPrice } from './cartSlice';

describe('cartSlice', () => {
  const initialCartState = {
    items: [],
    totalPrice: 0,
  };

  it('should handle adding an item', () => {
    const newState = cartReducer(initialCartState, addItem({ id: '1', price: 100, quantity: 1 }));
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].id).toBe('1');
  });

  it('should handle removing an item', () => {
    const stateWithItem = {
      ...initialCartState,
      items: [{ id: '1', price: 100, quantity: 1 }]
    };
    const newState = cartReducer(stateWithItem, removeItem('1'));
    expect(newState.items).toHaveLength(0);
  });

  it('should handle updating item quantity', () => {
    const stateWithItem = {
      ...initialCartState,
      items: [{ id: '1', price: 100, quantity: 1 }]
    };
    const newState = cartReducer(stateWithItem, updateQuantity({ id: '1', quantity: 3 }));
    expect(newState.items[0].quantity).toBe(3);
  });

  it('should calculate total price correctly', () => {
    const stateWithItems = {
      ...initialCartState,
      items: [
        { id: '1', price: 100, quantity: 1 },
        { id: '2', price: 200, quantity: 2 }
      ]
    };
    const newState = cartReducer(stateWithItems, updateTotalPrice());
    expect(newState.totalPrice).toBe(500);
  });
});
