import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import ThemeSwitcher from './ThemeSwitcher';

it('toggles theme from light to dark', () => {
  const { getByText } = render(
    <Provider store={store}>
      <ThemeSwitcher />
    </Provider>
  );

  const button = getByText('Switch to Dark Mode');
  fireEvent.click(button);
  expect(getByText('Switch to Light Mode')).toBeTruthy();
});