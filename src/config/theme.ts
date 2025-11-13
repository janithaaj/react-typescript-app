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

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const root = window.document.documentElement;

  root.classList.remove('light', 'dark');

  if (theme === 'dark') {
    root.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    document.body.classList.remove('dark');
  }

  root.setAttribute('data-theme', theme);
};
