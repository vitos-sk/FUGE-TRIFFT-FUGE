import styled, { keyframes, css } from 'styled-components';

export type ToastType = 'success' | 'error' | 'info';

export const toastPalette: Record<ToastType, { bg: string; border: string; progress: string }> = {
  success: {
    bg: '#0f2818',
    border: '#22a35a44',
    progress: '#22a35a',
  },
  error: {
    bg: '#2a0a0a',
    border: '#cc222244',
    progress: '#cc2222',
  },
  info: {
    bg: '#0d1a2a',
    border: '#3b82f644',
    progress: '#3b82f6',
  },
};

export const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100%) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
`;

export const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(110%) scale(0.95); }
`;

export const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;

  @media (max-width: 768px) {
    bottom: 88px;
    right: 12px;
    left: 12px;
  }
`;

export const ToastEl = styled.div<{ $type: ToastType; $exiting: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  border: 1px solid ${({ $type }) => toastPalette[$type].border};
  background: ${({ $type }) => toastPalette[$type].bg};
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 2px 8px rgba(0, 0, 0, 0.4);
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
  animation: ${({ $exiting }) =>
    $exiting
      ? css`
          ${slideOut} 0.25s ease forwards
        `
      : css`
          ${slideIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1)
        `};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: unset;
    max-width: 100%;
    width: 100%;
  }
`;

export const ProgressBar = styled.div<{ $type: ToastType; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${({ $type }) => toastPalette[$type].progress};
  animation: shrink ${({ $duration }) => $duration}ms linear forwards;

  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

export const IconCircle = styled.div<{ $type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $type }) => toastPalette[$type].progress}28;
  color: ${({ $type }) => toastPalette[$type].progress};
  border: 1px solid ${({ $type }) => toastPalette[$type].progress}40;
`;

export const ToastMessage = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #f0f0f0;
  line-height: 1.4;
  flex: 1;
`;

export const DismissBtn = styled.button`
  color: #555;
  font-size: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.15s;
  &:hover {
    color: #999;
  }
`;

export const ActionBtn = styled.button<{ $type: ToastType }>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $type }) => toastPalette[$type].progress};
  background: ${({ $type }) => toastPalette[$type].progress}18;
  border: 1px solid ${({ $type }) => toastPalette[$type].progress}33;
  border-radius: 5px;
  padding: 4px 10px;
  flex-shrink: 0;
  transition: all 0.15s;
  &:hover {
    background: ${({ $type }) => toastPalette[$type].progress}2e;
    border-color: ${({ $type }) => toastPalette[$type].progress}66;
  }
`;
