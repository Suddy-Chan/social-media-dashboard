import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return default values if context is undefined
  if (context === undefined) {
    return { darkMode: false, toggleDarkMode: () => {} };
  }
  return context;
}; 