import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ThemeContextType, ThemeMode } from '../types/theme';
import { themeConfig, getSystemTheme, applyTheme } from '../config/theme';
import { ThemeContext } from './ThemeContextValue';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that provides theme context.
 * @param {ThemeProviderProps} props - Component props.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return themeConfig.defaultMode;
    }
    const stored = localStorage.getItem(
      themeConfig.storageKey
    ) as ThemeMode | null;
    return stored || themeConfig.defaultMode;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  });

  /**
   * Sets the theme mode.
   * @param {ThemeMode} newTheme - The new theme mode.
   */
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(themeConfig.storageKey, newTheme);
    }
  }, []);

  /**
   * Toggles between light and dark themes.
   */
  const toggleTheme = useCallback(() => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // If system, toggle to opposite of current resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    }
  }, [theme, resolvedTheme, setTheme]);

  // Update resolved theme when theme changes
  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        applyTheme(newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setResolvedTheme(theme);
      applyTheme(theme);
    }
  }, [theme]);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
