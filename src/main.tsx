import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider, AuthProvider, DiagramsProvider } from './context';
import { Navigation } from './navigation';
import { getSystemTheme, applyTheme } from './config/theme';

// Apply initial theme before React renders
const storedTheme = localStorage.getItem('theme-mode') as
  | 'light'
  | 'dark'
  | 'system'
  | null;
const initialTheme =
  storedTheme === 'system' || !storedTheme
    ? getSystemTheme()
    : storedTheme === 'dark'
      ? 'dark'
      : 'light';
applyTheme(initialTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DiagramsProvider>
          <Navigation />
        </DiagramsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
