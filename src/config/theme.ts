export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  storageKey: string;
  defaultMode: ThemeMode;
}

export const themeConfig: ThemeConfig = {
  mode: 'system',
  storageKey: 'theme-mode',
  defaultMode: 'system',
};

/**
 * Gets the system theme preference.
 * @returns {'light' | 'dark'} The system theme.
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Applies the theme to the document.
 * @param {'light' | 'dark'} theme - The theme to apply.
 */
export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const root = window.document.documentElement;

  // Remove both classes first
  root.classList.remove('light', 'dark');

  // Add the appropriate class - Tailwind v4 uses 'dark' class for dark mode
  if (theme === 'dark') {
    root.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    document.body.classList.remove('dark');
  }

  root.setAttribute('data-theme', theme);
};
