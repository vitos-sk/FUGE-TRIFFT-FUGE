import styled, { css, keyframes } from 'styled-components';

const fadeSlideOut = keyframes`
  0%   { opacity: 1; transform: scale(1);    max-height: 200px; margin-bottom: 0; }
  60%  { opacity: 0; transform: scale(0.96); max-height: 200px; }
  100% { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: -14px; padding: 0; }
`;

export const Card = styled.div<{ $archiving: boolean }>`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 10px 30px rgba(0, 0, 0, 0.45);
  }

  &:active {
    opacity: 0.88;
    transition: opacity 0.08s;
  }

  ${({ $archiving }) =>
    $archiving &&
    css`
      animation: ${fadeSlideOut} 0.5s ease forwards;
      pointer-events: none;
      cursor: default;
      &:hover {
        background: rgba(255, 255, 255, 0.04);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.08);
      }
    `}
`;

/** Square preview on the left. Holds a placeholder icon behind the map image. */
export const Thumb = styled.div`
  position: relative;
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};

  img {
    position: absolute;
    inset: 0;
  }

  @media (max-width: 400px) {
    width: 66px;
    height: 66px;
  }
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Location = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.35;
  min-width: 0;

  svg { flex-shrink: 0; }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 3px;
`;

export const MetaItem = styled.div<{ $warn?: boolean; $soon?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  ${({ $warn, theme }) => $warn && css`color: ${theme.colors.accent};`}
  ${({ $soon }) => $soon && css`color: #c9a84c;`}
  ${({ $warn, $soon, theme }) => !$warn && !$soon && css`color: ${theme.colors.textSecondary};`}
`;

/** Right-hand column: admin menu (optional) + chevron */
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Chevron = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const MenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const MenuBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const Dropdown = styled.div`
  position: fixed;
  background: rgba(16, 16, 16, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  min-width: 190px;
  z-index: 1000;
  overflow: hidden;
`;

export const DropdownItem = styled.button<{ $danger?: boolean; $success?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $success, $danger, theme }) =>
    $success ? theme.colors.success : $danger ? theme.colors.accent : theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${({ $success, $danger, theme }) =>
      $success
        ? `${theme.colors.success}14`
        : $danger
        ? theme.colors.accentDim
        : theme.colors.bgElevated};
    color: ${({ $success, $danger, theme }) =>
      $success ? theme.colors.success : $danger ? theme.colors.accent : theme.colors.textPrimary};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;
