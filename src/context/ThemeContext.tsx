import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { STORAGE_KEYS, getString, setString } from '@/src/lib/storage';

type ThemeMode = 'dark' | 'light';

const themes = {
  dark: {
    mode: 'dark' as ThemeMode,
    colors: {
      background: '#1a1612',
      card: '#1c1810',
      muted: '#7a6e62',
      text: '#faf8f4',
      accent: '#c9a84c',
      border: 'rgba(201,168,76,0.2)',
      overlay: 'rgba(255,255,255,0.04)',
      success: '#7fa382',
      danger: '#de7b77',
    },
  },
  light: {
    mode: 'light' as ThemeMode,
    colors: {
      background: '#f5f0e8',
      card: '#fffaf2',
      muted: '#73685c',
      text: '#1a1612',
      accent: '#c9a84c',
      border: 'rgba(201,168,76,0.2)',
      overlay: 'rgba(26,22,18,0.04)',
      success: '#5f8a64',
      danger: '#b8574e',
    },
  },
};

type ThemeContextValue = {
  theme: (typeof themes)[ThemeMode];
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function RajulThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>((getString(STORAGE_KEYS.settingsTheme) as ThemeMode | undefined) ?? 'dark');

  useEffect(() => {
    setString(STORAGE_KEYS.settingsTheme, mode);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[mode],
      mode,
      setMode: setModeState,
      toggleMode: () => setModeState((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside RajulThemeProvider.');
  }

  return context;
}
