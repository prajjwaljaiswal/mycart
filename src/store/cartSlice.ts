import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const loadCart = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const saveCart = (state: CartState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

cartSlice.reducer = (state = initialState, action) => {
  const newState = cartSlice.caseReducers[action.type]
    ? cartSlice.caseReducers[action.type](state, action)
    : state;
  saveCart(newState);
  return newState;
};

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;