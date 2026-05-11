import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiCheck, FiX, FiInfo } from 'react-icons/fi';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
});

export const useToast = () => useContext(ToastContext);

// ─── Animations ───────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(100%) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(110%) scale(0.95); }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────

const Container = styled.div`
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

const toastColors: Record<ToastType, { bg: string; border: string; icon: React.ReactNode; progress: string }> = {
  success: { bg: '#0f2818', border: '#22a35a44', icon: <FiCheck size={13} />,  progress: '#22a35a' },
  error:   { bg: '#2a0a0a', border: '#cc222244', icon: <FiX size={13} />,      progress: '#cc2222' },
  info:    { bg: '#0d1a2a', border: '#3b82f644', icon: <FiInfo size={13} />,   progress: '#3b82f6' },
};

const ToastEl = styled.div<{ $type: ToastType; $exiting: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  border: 1px solid ${({ $type }) => toastColors[$type].border};
  background: ${({ $type }) => toastColors[$type].bg};
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
  animation: ${({ $exiting }) => $exiting
    ? css`${slideOut} 0.25s ease forwards`
    : css`${slideIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1)`
  };
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: unset;
    max-width: 100%;
    width: 100%;
  }
`;

const ProgressBar = styled.div<{ $type: ToastType; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${({ $type }) => toastColors[$type].progress};
  animation: shrink ${({ $duration }) => $duration}ms linear forwards;

  @keyframes shrink {
    from { width: 100%; }
    to   { width: 0%; }
  }
`;

const IconCircle = styled.div<{ $type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $type }) => toastColors[$type].progress}28;
  color: ${({ $type }) => toastColors[$type].progress};
  border: 1px solid ${({ $type }) => toastColors[$type].progress}40;
`;

const Message = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #f0f0f0;
  line-height: 1.4;
  flex: 1;
`;

const DismissBtn = styled.button`
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
  &:hover { color: #999; }
`;

// ─── Provider ─────────────────────────────────────────────────────────────────

const DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastItem & { exiting: boolean })[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 280);
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, message, type, exiting: false }]);
    setTimeout(() => dismiss(id), DURATION);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Container>
        {toasts.map((t) => (
          <ToastEl key={t.id} $type={t.type} $exiting={t.exiting}>
            <IconCircle $type={t.type}>{toastColors[t.type].icon}</IconCircle>
            <Message>{t.message}</Message>
            <DismissBtn onClick={() => dismiss(t.id)}><FiX size={13} /></DismissBtn>
            {!t.exiting && <ProgressBar $type={t.type} $duration={DURATION} />}
          </ToastEl>
        ))}
      </Container>
    </ToastContext.Provider>
  );
};
