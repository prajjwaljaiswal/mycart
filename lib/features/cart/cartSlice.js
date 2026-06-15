import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: {},
    totalPrice: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId, price } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId].quantity++
            } else {
                state.cartItems[productId] = { quantity: 1, price }
            }
            state.totalPrice += price
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId].quantity--
                state.totalPrice -= state.cartItems[productId].price
                if (state.cartItems[productId].quantity === 0) {
                    delete state.cartItems[productId]
                }
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.totalPrice -= state.cartItems[productId].price * state.cartItems[productId].quantity
                delete state.cartItems[productId]
            }
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.totalPrice = 0
        },
        updateTotalPrice: (state) => {
            state.totalPrice = Object.values(state.cartItems).reduce((total, item) => {
                return total + (item.price * item.quantity)
            }, 0)
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, updateTotalPrice } = cartSlice.actions

export default cartSlice.reducer