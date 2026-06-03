import themeReducer, { toggleTheme } from './themeSlice';

const initialState = { theme: 'light' };

describe('Theme Slice', () => {
  it('should return the initial state', () => {
    expect(themeReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle toggleTheme action', () => {
    const previousState = { theme: 'light' };
    expect(themeReducer(previousState, toggleTheme())).toEqual({ theme: 'dark' });
  });

  it('should toggle back to light', () => {
    const previousState = { theme: 'dark' };
    expect(themeReducer(previousState, toggleTheme())).toEqual({ theme: 'light' });
  });
});
