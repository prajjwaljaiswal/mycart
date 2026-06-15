import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from './ProductList';

test('renders product list with mock data', () => {
  render(<ProductList />);
  expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
  expect(screen.getByText(/Product 3/i)).toBeInTheDocument();
  expect(screen.getAllByRole('img').length).toBe(3);
});
