'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // Force initial theme check
    const theme = localStorage.getItem('theme') || 'system';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const actualTheme = theme === 'system' ? systemTheme : theme;
    
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}