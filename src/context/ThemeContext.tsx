import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeConfig } from '../types';
import { purpleDreamTheme } from '../themes';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode; defaultTheme?: ThemeConfig }> = ({
  children,
  defaultTheme = purpleDreamTheme,
}) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        style={{
          '--bg-primary': theme.background.primary,
          '--bg-secondary': theme.background.secondary,
          '--bg-card': theme.background.card,
          '--accent-primary': theme.accent.primary,
          '--accent-secondary': theme.accent.secondary,
          '--accent-glow': theme.accent.glow,
          '--text-primary': theme.text.primary,
          '--text-secondary': theme.text.secondary,
          '--text-muted': theme.text.muted,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
