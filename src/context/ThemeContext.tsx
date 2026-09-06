'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Theme } from '@/lib/antigravityCanvas';

// ── CSS variable sets per theme ────────────────────────────────────────────────
const THEME_VARS: Record<Theme, Record<string, string>> = {
  dark: {
    '--bg':             '#07060e',
    '--bg-surface':     '#0f0e1c',
    '--bg-elevated':    '#151329',
    '--border':         '#231e3d',
    '--border-hover':   '#ff2a8d',
    '--text-primary':   '#f1f5f9',
    '--text-muted':     '#94a3b8',
    '--text-subtle':    '#64748b',
    '--accent':         '#ff2a8d',
    '--accent2':        '#00f0ff',
    '--accent3':        '#b026ff',
    '--accent-glow':    'rgba(255,42,141,0.55)',
    '--orb-color':      '#ff2a8d',
    '--orb-glow':       'rgba(255,42,141,0.8)',
    '--scrollbar-thumb':'#231e3d',
  },
  light: {
    '--bg':             '#f0eeff',
    '--bg-surface':     '#ffffff',
    '--bg-elevated':    '#faf9ff',
    '--border':         '#ddd8f5',
    '--border-hover':   '#7c3aed',
    '--text-primary':   '#1a1040',
    '--text-muted':     '#6b7280',
    '--text-subtle':    '#9ca3af',
    '--accent':         '#7c3aed',
    '--accent2':        '#db2777',
    '--accent3':        '#f59e0b',
    '--accent-glow':    'rgba(124,58,237,0.4)',
    '--orb-color':      '#f59e0b',
    '--orb-glow':       'rgba(245,158,11,0.8)',
    '--scrollbar-thumb':'#c4b5fd',
  },
  violet: {
    '--bg':             '#120a2e',
    '--bg-surface':     '#1a1040',
    '--bg-elevated':    '#231454',
    '--border':         '#3a1f6e',
    '--border-hover':   '#8b5cf6',
    '--text-primary':   '#ede9fe',
    '--text-muted':     '#a78bfa',
    '--text-subtle':    '#7c3aed',
    '--accent':         '#8b5cf6',
    '--accent2':        '#c084fc',
    '--accent3':        '#e879f9',
    '--accent-glow':    'rgba(139,92,246,0.6)',
    '--orb-color':      '#c084fc',
    '--orb-glow':       'rgba(192,132,252,0.9)',
    '--scrollbar-thumb':'#3a1f6e',
  },
  neon: {
    '--bg':             '#04030d',
    '--bg-surface':     '#080614',
    '--bg-elevated':    '#0c0920',
    '--border':         '#1a0a3e',
    '--border-hover':   '#00f0ff',
    '--text-primary':   '#f0f0ff',
    '--text-muted':     '#7c3aed',
    '--text-subtle':    '#4c1d95',
    '--accent':         '#00f0ff',
    '--accent2':        '#ff2a8d',
    '--accent3':        '#39ff14',
    '--accent-glow':    'rgba(0,240,255,0.65)',
    '--orb-color':      '#00f0ff',
    '--orb-glow':       'rgba(0,240,255,1)',
    '--scrollbar-thumb':'#1a0a3e',
  },
};

const THEME_ORDER: Theme[] = ['dark', 'light', 'violet', 'neon'];

// ── Apply CSS vars to :root ────────────────────────────────────────────────────
function applyThemeVars(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  const vars = THEME_VARS[theme];
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val);
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => Theme; // returns the NEXT theme (so button can animate before applying)
  themeVars: Record<Theme, Record<string, string>>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  cycleTheme: () => 'light',
  themeVars: THEME_VARS,
});

// ── Provider ───────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Safe initializer — reads window.__THEME__ set by inline script in layout
    if (typeof window !== 'undefined') {
      return ((window as unknown as Record<string, unknown>).__THEME__ as Theme) || 'dark';
    }
    return 'dark';
  });

  // Apply CSS vars on first mount and whenever theme changes
  useEffect(() => {
    applyThemeVars(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dramabox-theme', t);
    }
  }, []);

  // Returns the next theme in cycle WITHOUT applying it yet
  const cycleTheme = useCallback((): Theme => {
    const idx = THEME_ORDER.indexOf(theme);
    return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themeVars: THEME_VARS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { THEME_VARS, THEME_ORDER };
export type { Theme };
