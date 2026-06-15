import React, { useContext, createContext } from 'react';
import { useSelector } from 'react-redux';
import { themeSelector } from '../features/theme/themeSlice';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = useSelector(themeSelector);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};