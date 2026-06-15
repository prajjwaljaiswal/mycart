import themeReducer, { toggleTheme } from './themeSlice';

it('should toggle theme from light to dark', () => {
  const initialState = 'light';
  const state = themeReducer(initialState, toggleTheme());
  expect(state).toBe('dark');
});

it('should toggle theme from dark to light', () => {
  const initialState = 'dark';
  const state = themeReducer(initialState, toggleTheme());
  expect(state).toBe('light');
});