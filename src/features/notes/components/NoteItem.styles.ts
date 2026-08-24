import styled, { keyframes, css } from 'styled-components';
import { glassSurfaceFlat } from '../../../styles/glass';

/* Keeps the glass top highlight while the ring flashes */
const flashHighlight = keyframes`
  0%   { box-shadow: 0 0 0 3px rgba(204,34,34,0.7), inset 0 1px 0 rgba(255,255,255,0.06); }
  70%  { box-shadow: 0 0 0 6px rgba(204,34,34,0.2), inset 0 1px 0 rgba(255,255,255,0.06); }
  100% { box-shadow: 0 0 0 0 rgba(204,34,34,0), inset 0 1px 0 rgba(255,255,255,0.06); }
`;

/* One chat row: avatar + bubble, mirrored for own messages */
export const Row = styled.div<{ $isOwn: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-direction: ${({ $isOwn }) => ($isOwn ? 'row-reverse' : 'row')};
`;

export const Avatar = styled.div<{ $isOwn: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 700;
  user-select: none;
  background: ${({ $isOwn, theme }) =>
    $isOwn ? theme.colors.accentDim : 'rgba(255,255,255,0.07)'};
  border: 1px solid
    ${({ $isOwn }) => ($isOwn ? 'rgba(204,34,34,0.4)' : 'rgba(255,255,255,0.1)')};
  color: ${({ $isOwn, theme }) =>
    $isOwn ? theme.colors.accentHover : theme.colors.textSecondary};
`;

export const Column = styled.div<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  gap: 4px;
  max-width: min(78%, 520px);
  min-width: 0;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 2px;
`;

export const Author = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Time = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MenuBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
    background: rgba(255, 255, 255, 0.06);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const Bubble = styled.div<{ $isOwn: boolean; $highlighted?: boolean }>`
  padding: 11px 14px;
  border-radius: 14px;
  font-size: 14.5px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  box-shadow: ${({ theme }) => theme.glass.highlight};
  animation: ${({ $highlighted }) => ($highlighted ? flashHighlight : 'none')}
    1.4s ease-out;

  ${({ $isOwn, theme }) =>
    $isOwn
      ? css`
          /* Tinted glass: the accent stays readable, the backdrop shows through */
          background: rgba(204, 34, 34, 0.72);
          border: 1px solid rgba(229, 51, 51, 0.75);
          border-bottom-right-radius: 4px;
          color: #fff;

          @supports (backdrop-filter: blur(1px)) or
            (-webkit-backdrop-filter: blur(1px)) {
            backdrop-filter: ${theme.glass.blur};
            -webkit-backdrop-filter: ${theme.glass.blur};
          }
        `
      : css`
          ${glassSurfaceFlat};
          border-bottom-left-radius: 4px;
          color: ${theme.colors.textPrimary};
        `}
`;

/* Inline edit mode replaces the bubble body */
export const EditBox = styled.div`
  width: 100%;
  min-width: min(78vw, 420px);
`;

export const EditRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
`;

export const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SheetAction = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.textPrimary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgElevated};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:active {
    opacity: 0.85;
  }
`;
