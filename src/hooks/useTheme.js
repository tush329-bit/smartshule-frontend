// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Check localStorage or system preference on load
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('smartshule_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('smartshule_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smartshule_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
};