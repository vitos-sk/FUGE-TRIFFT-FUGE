import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from './Button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

// ─── Context ──────────────────────────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmFn>(async () => false);

export const useConfirm = () => useContext(ConfirmContext);

// ─── Styled ───────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
  animation: ${fadeIn} 0.15s ease;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.modal};
  width: 100%;
  max-width: 380px;
  padding: 28px;
  animation: ${popIn} 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 10px;
  letter-spacing: -0.01em;
`;

const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

// ─── Provider ─────────────────────────────────────────────────────────────────

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  const handleResponse = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <Overlay onClick={(e) => e.target === e.currentTarget && handleResponse(false)}>
          <Dialog>
            <Title>{pending.options.title}</Title>
            <Message>{pending.options.message}</Message>
            <Actions>
              <Button $variant="secondary" onClick={() => handleResponse(false)}>
                {pending.options.cancelLabel ?? 'Abbrechen'}
              </Button>
              <Button
                $variant={pending.options.danger ? 'danger' : 'primary'}
                onClick={() => handleResponse(true)}
              >
                {pending.options.confirmLabel ?? 'Bestätigen'}
              </Button>
            </Actions>
          </Dialog>
        </Overlay>
      )}
    </ConfirmContext.Provider>
  );
};
