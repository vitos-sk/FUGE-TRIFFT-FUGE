import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";
import {
  Container,
  ToastEl,
  ProgressBar,
  IconCircle,
  ToastMessage,
  DismissBtn,
  ActionBtn,
} from "./Toast.styles";
import type { ToastType } from "./Toast.styles";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  action?: ToastAction;
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
  duration: number;
}

interface ToastContextValue {
  success: (message: string, opts?: ToastOptions) => void;
  error: (message: string, opts?: ToastOptions) => void;
  info: (message: string, opts?: ToastOptions) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
});

export const useToast = () => useContext(ToastContext);

// ─── Icons map ────────────────────────────────────────────────────────────────

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <FiCheck size={13} />,
  error: <FiX size={13} />,
  info: <FiInfo size={13} />,
};

// ─── Provider ─────────────────────────────────────────────────────────────────

const DEFAULT_DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastItem & { exiting: boolean })[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 280);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, opts?: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const duration = opts?.duration ?? DEFAULT_DURATION;
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, message, type, action: opts?.action, duration, exiting: false },
      ]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value: ToastContextValue = {
    success: (msg, opts) => addToast(msg, "success", opts),
    error: (msg, opts) => addToast(msg, "error", opts),
    info: (msg, opts) => addToast(msg, "info", opts),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Container>
        {toasts.map((t) => (
          <ToastEl key={t.id} $type={t.type} $exiting={t.exiting}>
            <IconCircle $type={t.type}>{toastIcons[t.type]}</IconCircle>
            <ToastMessage>{t.message}</ToastMessage>
            {t.action && (
              <ActionBtn
                $type={t.type}
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </ActionBtn>
            )}
            <DismissBtn onClick={() => dismiss(t.id)}>
              <FiX size={13} />
            </DismissBtn>
            {!t.exiting && <ProgressBar $type={t.type} $duration={t.duration} />}
          </ToastEl>
        ))}
      </Container>
    </ToastContext.Provider>
  );
};
