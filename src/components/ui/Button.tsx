import styled, { css } from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  $size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all ${({ theme }) => theme.transitions.spring};
  white-space: nowrap;
  border: 1px solid transparent;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  outline: none;

  &:focus-visible {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  ${({ $size = 'md' }) => {
    if ($size === 'sm') return css`padding: 5px 12px; font-size: 10px; letter-spacing: 0.06em;`;
    if ($size === 'lg') return css`padding: 13px 28px; font-size: 12px;`;
    return css`padding: 9px 18px; font-size: 11px;`;
  }}

  ${({ fullWidth }) => fullWidth && css`width: 100%;`}

  ${({ $variant = 'primary', theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: ${theme.colors.accent};
          color: #fff;
          border-color: ${theme.colors.accent};
          &:hover:not(:disabled) {
            background: ${theme.colors.accentHover};
            border-color: ${theme.colors.accentHover};
            box-shadow: 0 4px 20px rgba(204,34,34,0.35), 0 1px 4px rgba(0,0,0,0.3);
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(204,34,34,0.2);
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.bgElevated};
          color: ${theme.colors.textSecondary};
          border-color: ${theme.colors.border};
          &:hover:not(:disabled) {
            color: ${theme.colors.textPrimary};
            border-color: ${theme.colors.borderHover};
            background: #242424;
          }
          &:active:not(:disabled) {
            background: ${theme.colors.bgCard};
          }
        `;
      case 'danger':
        return css`
          background: transparent;
          color: ${theme.colors.accent};
          border-color: ${theme.colors.accent}55;
          &:hover:not(:disabled) {
            background: ${theme.colors.accentDim};
            border-color: ${theme.colors.accent};
            box-shadow: 0 0 16px rgba(204,34,34,0.15);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.textMuted};
          border-color: transparent;
          &:hover:not(:disabled) {
            color: ${theme.colors.textPrimary};
            background: rgba(255,255,255,0.06);
          }
          &:active:not(:disabled) {
            background: rgba(255,255,255,0.03);
          }
        `;
    }
  }}

  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;
