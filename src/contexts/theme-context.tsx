'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The actual resolved theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  actualTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  // Get system theme preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }, []);

  // Calculate actual theme based on preference
  const calculateActualTheme = useCallback(
    (themePreference: Theme): 'light' | 'dark' => {
      if (themePreference === 'system') {
        return getSystemTheme();
      }
      return themePreference;
    },
    [getSystemTheme],
  );

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    setActualTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get stored preference or default to system
    const stored = localStorage.getItem('theme') as Theme;
    const initialTheme = stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';

    setTheme(initialTheme);
    const resolvedTheme = calculateActualTheme(initialTheme);
    applyTheme(resolvedTheme);
  }, [calculateActualTheme]);

  // Listen for system theme changes when using system preference
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const newSystemTheme = getSystemTheme();
      applyTheme(newSystemTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, getSystemTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolvedTheme = calculateActualTheme(newTheme);
    applyTheme(resolvedTheme);
  };

  const toggleTheme = () => {
    // Simple toggle between light and dark (not system)
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
