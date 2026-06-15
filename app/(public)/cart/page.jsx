import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity } from '../../../lib/features/cart/cartSlice';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();

    const handleIncrement = (productId) => {
        dispatch(incrementQuantity(productId));
    };

    const handleDecrement = (productId) => {
        dispatch(decrementQuantity(productId));
    };

    return (
        <div className='cart-page'>
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className='cart-item'>
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => handleIncrement(item.id)}>+</button>
                            <button onClick={() => handleDecrement(item.id)}>-</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartPage;