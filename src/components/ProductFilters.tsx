import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/store/productSlice';

const ProductFilters = () => {
    const dispatch = useDispatch();
    const [category, setCategory] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const applyFilters = () => {
        dispatch(setFilters({ category, priceMin, priceMax, sortBy, sortOrder }));
    };

    return (
        <div>
            <input placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} />
            <input placeholder='Min Price' type='number' value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
            <input placeholder='Max Price' type='number' value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value=''>Sort By</option>
                <option value='price'>Price</option>
                <option value='name'>Name</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
            </select>
            <button onClick={applyFilters}>Apply</button>
        </div>
    );
};

export default ProductFilters;