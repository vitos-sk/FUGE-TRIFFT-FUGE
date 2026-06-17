import React, { useEffect, useRef, useId } from 'react';
import { FiX } from 'react-icons/fi';
import {
  Overlay, ModalBox, ModalHeader, ModalTitle, CloseBtn,
  ModalSubheader, ModalBody, ModalFooterRow,
} from './Modal.styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  subheader?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, children, width, height, subheader, footer,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflowY = 'hidden';

    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    const frameId = requestAnimationFrame(() => {
      const els = getFocusable();
      els[0]?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflowY = '';
      prevFocus?.focus();
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalBox
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        width={width}
        $height={height}
      >
        <ModalHeader>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <CloseBtn onClick={onClose} aria-label="Schließen"><FiX size={16} /></CloseBtn>
        </ModalHeader>
        {subheader && <ModalSubheader>{subheader}</ModalSubheader>}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooterRow>{footer}</ModalFooterRow>}
      </ModalBox>
    </Overlay>
  );
};
