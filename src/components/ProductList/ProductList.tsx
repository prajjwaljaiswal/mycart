import React from 'react';
import './ProductList.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 99.99, imageUrl: '/assets/product_img1.png' },
  { id: '2', name: 'Product 2', price: 79.99, imageUrl: '/assets/product_img2.png' },
  { id: '3', name: 'Product 3', price: 69.99, imageUrl: '/assets/product_img3.png' }
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="product-card">
    <img src={product.imageUrl} alt={product.name} className="product-image" />
    <div className="product-info">
      <p className="product-title">{product.name}</p>
      <p className="product-price">${product.price.toFixed(2)}</p>
    </div>
  </div>
);

const ProductList: React.FC = () => {
  return (
    <div className="product-list">
      {mockProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
