import { css } from 'styled-components';

/**
 * Frosted-glass surface for panels, cards and bubbles.
 * Browsers without `backdrop-filter` (older Firefox, Safari < 15.4) fall back
 * to the opaque card background so nothing ever renders as unreadable haze.
 */
export const glassSurface = css`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.fill};
    backdrop-filter: ${({ theme }) => theme.glass.blur};
    -webkit-backdrop-filter: ${({ theme }) => theme.glass.blur};
    border-color: ${({ theme }) => theme.glass.border};
    box-shadow: ${({ theme }) => theme.glass.highlight},
      ${({ theme }) => theme.glass.shadow};
  }
`;

/** Same material, no drop shadow — for elements that own their box-shadow
 *  (highlight flashes, focus rings). */
export const glassSurfaceFlat = css`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.fill};
    backdrop-filter: ${({ theme }) => theme.glass.blur};
    -webkit-backdrop-filter: ${({ theme }) => theme.glass.blur};
    border-color: ${({ theme }) => theme.glass.border};
  }
`;

/** Denser variant for sticky/fixed app bars — content scrolls right beneath. */
export const glassBar = css`
  background: rgba(10, 10, 10, 0.92);

  @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.barFill};
    backdrop-filter: ${({ theme }) => theme.glass.barBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.glass.barBlur};
  }
`;
