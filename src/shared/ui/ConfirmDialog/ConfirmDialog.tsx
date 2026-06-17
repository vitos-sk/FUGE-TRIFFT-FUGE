import React, { createContext, useContext, useState, useCallback } from 'react';
import { Button } from '../Button';
import { Overlay, Dialog, Title, Message, Actions } from './ConfirmDialog.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  success?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

// ─── Context ──────────────────────────────────────────────────────────────────

const ConfirmContext = createContext<ConfirmFn>(async () => false);

export const useConfirm = () => useContext(ConfirmContext);

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
          <Dialog role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
            <Title id="confirm-title">{pending.options.title}</Title>
            <Message id="confirm-msg">{pending.options.message}</Message>
            <Actions>
              <Button $variant="secondary" onClick={() => handleResponse(false)}>
                {pending.options.cancelLabel ?? 'Abbrechen'}
              </Button>
              <Button
                $variant={pending.options.danger ? 'danger' : pending.options.success ? 'success' : 'primary'}
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
