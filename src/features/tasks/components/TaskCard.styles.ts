import styled, { css, type DefaultTheme } from 'styled-components';
import type { TaskStatus } from '@shared/types';

const stripeColor = ({ $status, theme }: { $status: TaskStatus; theme: DefaultTheme }) => {
  if ($status === 'in_progress') return theme.colors.accent;
  if ($status === 'done') return theme.colors.success;
  return theme.colors.textMuted;
};

export const Card = styled.div<{ $status: TaskStatus }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 14px 14px 14px 20px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${stripeColor};
  }
`;

export const Title = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
`;

export const MetaCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const Description = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

export const ActionBtn = styled.button<{ $variant?: 'secondary' | 'success' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  min-width: 120px;
  min-height: 44px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $variant, theme }) =>
    $variant === 'success'
      ? css`
          background: ${theme.colors.success};
          color: #fff;
          &:hover { background: ${theme.colors.successHover}; }
        `
      : css`
          background: rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.75);
          border-color: rgba(255, 255, 255, 0.14);
          &:hover { background: rgba(255, 255, 255, 0.11); color: #fff; }
        `}
`;

export const WhatsAppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  min-width: 120px;
  min-height: 44px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: #25D366;
    color: #25D366;
  }
`;
