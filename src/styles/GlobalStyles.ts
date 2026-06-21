import { createGlobalStyle } from 'styled-components';

// Organic swirling texture — dark turbulence shapes
const _organic = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700"><filter id="t"><feTurbulence type="turbulence" baseFrequency="0.013 0.018" numOctaves="7" seed="9"/><feColorMatrix type="matrix" values="0.08 0.02 0 0 0.01 0 0 0 0 0 0 0 0 0 0 3.5 0 0 0 -0.8"/></filter><rect width="700" height="700" filter="url(#t)"/></svg>`;

// Fine grain / noise particles
const _grain = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="1" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 9 -6"/></filter><rect width="200" height="200" filter="url(#g)"/></svg>`;

const organicUrl = `url("data:image/svg+xml,${encodeURIComponent(_organic)}")`;
const grainUrl   = `url("data:image/svg+xml,${encodeURIComponent(_grain)}")`;

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
    overflow-x: hidden;
    /* base canvas so pseudo-elements can show through transparent body */
    background-color: #060303;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.base};
    /* transparent so html bg + pseudo-elements are visible beneath */
    background-color: transparent;
    background-image:
      radial-gradient(ellipse 65% 85% at 12% 45%, rgba(100,6,6,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 55% 65% at 82% 65%, rgba(78,4,4,0.06) 0%, transparent 55%),
      radial-gradient(ellipse 40% 50% at 55% 18%, rgba(62,3,3,0.04) 0%, transparent 48%);
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.5;
    min-height: 100dvh;
    touch-action: pan-x pan-y;
    overscroll-behavior: none;
  }

  /* organic turbulence layer — dark swirling shapes */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background-image: ${organicUrl};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.07;
    pointer-events: none;
  }

  /* fine grain / noise particles */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background-image: ${grainUrl};
    background-size: 200px 200px;
    background-repeat: repeat;
    opacity: 0.02;
    pointer-events: none;
  }

  #root {
    min-height: 100dvh;
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

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
