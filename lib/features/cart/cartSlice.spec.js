import cartReducer, { incrementItemQuantity, decrementItemQuantity } from './cartSlice';

describe('cartSlice', () => {
  it('should increment item quantity', () => {
    const initialState = { items: [{ id: '1', quantity: 1 }] };
    const action = incrementItemQuantity('1');
    const state = cartReducer(initialState, action);
    expect(state.items[0].quantity).toBe(2);
  });

  it('should decrement item quantity', () => {
    const initialState = { items: [{ id: '1', quantity: 2 }] };
    const action = decrementItemQuantity('1');
    const state = cartReducer(initialState, action);
    expect(state.items[0].quantity).toBe(1);
  });

  it('should not decrement item quantity below 1', () => {
    const initialState = { items: [{ id: '1', quantity: 1 }] };
    const action = decrementItemQuantity('1');
    const state = cartReducer(initialState, action);
    expect(state.items[0].quantity).toBe(1);
  });
});