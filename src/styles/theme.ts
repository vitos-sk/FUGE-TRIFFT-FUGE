import 'styled-components';

export const theme = {
  colors: {
    bgPrimary: '#0d0d0d',
    bgCard: '#161616',
    bgElevated: '#1e1e1e',
    accent: '#cc2222',
    accentHover: '#e53333',
    accentDim: '#cc222218',
    textPrimary: '#ffffff',
    textSecondary: '#8a8a8a',
    textMuted: '#444444',
    danger: '#cc2222',
    success: '#22a35a',
    warning: '#d97706',
    border: '#252525',
    borderHover: '#363636',
    statusNew: '#2563eb',
    statusInProgress: '#cc2222',
    statusPaused: '#525252',
    statusDone: '#22a35a',
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  borderRadius: '8px',
  borderRadiusSm: '6px',
  borderRadiusPill: '9999px',
  fonts: {
    base: "'Inter', system-ui, sans-serif",
  },
  shadows: {
    card: '0 1px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
    elevated: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
    modal: '0 24px 80px rgba(0,0,0,0.95), 0 8px 24px rgba(0,0,0,0.5)',
    red: '0 0 28px rgba(204,34,34,0.2)',
    focus: '0 0 0 3px rgba(204,34,34,0.22)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    spring: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type AppTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
