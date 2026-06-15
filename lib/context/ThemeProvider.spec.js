import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider, useTheme } from './ThemeProvider';

const TestComponent = () => {
  const theme = useTheme();
  return <span>{theme}</span>;
};

describe('ThemeProvider', () => {
  it('provides the current theme from the Redux store', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </Provider>
    );
    expect(getByText(store.getState().theme)).toBeInTheDocument();
  });
});