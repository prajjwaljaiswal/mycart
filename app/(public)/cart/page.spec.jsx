import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CartPage from './page';

const mockStore = configureStore([]);

describe('CartPage Component', () => {
    it('should render with empty cart message', () => {
        const initialState = { cart: { items: [] } };
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <CartPage />
            </Provider>
        );

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('should render cart items and allow quantity modification', () => {
        const initialState = {
            cart: {
                items: [
                    { id: '1', name: 'Product 1', price: 10, quantity: 1 },
                    { id: '2', name: 'Product 2', price: 20, quantity: 2 }
                ]
            }
        };
        const store = mockStore(initialState);

        render(
            <Provider store={store}>
                <CartPage />
            </Provider>
        );

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText(/Quantity: 1/)).toBeInTheDocument();
        expect(screen.getByText(/Quantity: 2/)).toBeInTheDocument();

        fireEvent.click(screen.getAllByText('+')[0]);
        fireEvent.click(screen.getAllByText('-')[1]);

        // Additional expectations to handle button click effects can be added here
    });
});