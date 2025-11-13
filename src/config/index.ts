export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  environment: import.meta.env.MODE || 'development',
};

export { themeConfig, getSystemTheme, applyTheme } from './theme';
export type { ThemeMode } from './theme';
