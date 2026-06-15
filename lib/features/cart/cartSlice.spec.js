import cartReducer, { addItem, removeItem, updateItemQuantity } from './cartSlice';

describe('cartSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = { items: [] };
  });

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('should handle addItem', () => {
    const payload = { id: '1', name: 'Product 1', quantity: 1 };
    const expected = { items: [payload] };
    const state = cartReducer(initialState, addItem(payload));
    expect(state).toEqual(expected);
  });

  it('should handle removeItem', () => {
    const stateWithItems = { items: [{ id: '1', name: 'Product 1', quantity: 1 }] };
    const expectedState = { items: [] };
    const state = cartReducer(stateWithItems, removeItem({ id: '1' }));
    expect(state).toEqual(expectedState);
  });

  it('should handle updateItemQuantity', () => {
    const stateWithItems = { items: [{ id: '1', name: 'Product 1', quantity: 1 }] };
    const expectedState = { items: [{ id: '1', name: 'Product 1', quantity: 3 }] };
    const state = cartReducer(stateWithItems, updateItemQuantity({ id: '1', quantity: 3 }));
    expect(state).toEqual(expectedState);
  });
});