import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type ThemeName, themes } from './themes';

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
};

const THEME_ORDER: ThemeName[] = ['purpleBlue', 'sunset', 'forest'];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    return (localStorage.getItem('theme') as ThemeName) || 'purpleBlue';
  });

  useEffect(() => {
    let t = themes[theme];
    if (!t) {
      t = themes['purpleBlue'];
      setTheme('purpleBlue');
    }
    localStorage.setItem('theme', t.name);
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', t.gradient);
    root.style.setProperty('--blob-1', t.blob1);
    root.style.setProperty('--blob-2', t.blob2);
    root.style.setProperty('--blob-3', t.blob3);
    root.style.setProperty('--particle', t.particle);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  };

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
