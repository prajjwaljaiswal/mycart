import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useSelector } from 'react-redux';

const ThemeLayout: React.FC = ({ children }) => {
  const theme = useSelector(state => state.theme);

  return (
    <div className={theme}>
      <ThemeSwitcher />
      {children}
    </div>
  );
};

export default ThemeLayout;