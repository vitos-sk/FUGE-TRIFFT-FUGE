import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    touch-action: pan-x pan-y;
    overscroll-behavior: none;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.base};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.5;
    min-height: 100vh;
    touch-action: pan-x pan-y;
    overscroll-behavior: none;
  }

  #root {
    min-height: 100vh;
  }

  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  input, textarea, select {
    font-family: inherit;
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    user-select: text;
  }

  :focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  /* Remove browser focus outlines from Recharts SVG elements */
  svg, svg *, [tabindex] {
    outline: none !important;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.colors.borderHover}; }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`;
