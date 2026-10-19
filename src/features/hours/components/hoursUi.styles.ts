import styled, { css } from 'styled-components';

/** Same breakpoint where the hours screen switches to the two-column desktop layout. */
export const DESKTOP = '@media (min-width: 1024px)';

/** Main control height: 44px on phones, 40px on desktop. */
export const controlHeight = css`
  min-height: 44px;

  ${DESKTOP} {
    min-height: 40px;
  }
`;

/** Flat "ticket" card: thin border, no shadow, no gradient. */
export const Card = styled.section`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

/** Dotted line between parts of a card, like the perforation of a ticket. */
export const Perforation = styled.hr`
  border: 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.14);
  margin: 0;
`;

export const Caption = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
`;

/** Top line of the sub-screens (form, calculator): back arrow + title. */
export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BackBtn = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** Secondary action: outlined, never filled. The single filled button is the main action. */
export const OutlineBtn = styled.button<{ $danger?: boolean; $done?: boolean }>`
  ${controlHeight}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;

  ${({ $danger, $done, theme }) =>
    $done
      ? css`
          color: ${theme.colors.success};
          border: 1px solid rgba(34, 163, 90, 0.45);
          background: rgba(34, 163, 90, 0.1);
        `
      : $danger
        ? css`
            color: #ff6060;
            border: 1px solid rgba(204, 34, 34, 0.5);
            background: transparent;
            &:hover:not(:disabled) {
              background: ${theme.colors.accentDim};
            }
          `
        : css`
            color: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.16);
            background: transparent;
            &:hover:not(:disabled) {
              background: rgba(255, 255, 255, 0.06);
            }
          `}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
`;
