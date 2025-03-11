import React, { createContext, useState, useEffect } from 'react';

// Create the context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {}
});

// Create a provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode was previously set in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Update localStorage and apply theme when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    applyTheme(darkMode);
  }, [darkMode]);

  // Apply the theme to the document
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Initialize theme on first render
  useEffect(() => {
    applyTheme(darkMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 