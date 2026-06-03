import { createSlice } from '@reduxjs/toolkit';

interface ProductState {
    filters: {
        category: string;
        priceMin: string;
        priceMax: string;
        sortBy: string;
        sortOrder: string;
    };
}

const initialState: ProductState = {
    filters: {
        category: '',
        priceMin: '',
        priceMax: '',
        sortBy: '',
        sortOrder: 'asc',
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters(state, action) {
            state.filters = action.payload;
        },
    },
});

export const { setFilters } = productSlice.actions;
export default productSlice.reducer;