import React, { useEffect, useRef, useId } from 'react';
import ReactDOM from 'react-dom';
import { FiX } from 'react-icons/fi';
import { lockScroll, unlockScroll } from '@shared/utils/scrollLock';
import { Overlay, Sheet, Handle, Header, Title, CloseBtn, Body } from './BottomSheet.styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    lockScroll();

    const getFocusable = () =>
      Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    const frameId = requestAnimationFrame(() => getFocusable()[0]?.focus());

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
      unlockScroll();
      prevFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <Handle />
        <Header>
          <Title id={titleId}>{title}</Title>
          <CloseBtn type="button" onClick={onClose} aria-label="Schließen">
            <FiX size={18} />
          </CloseBtn>
        </Header>
        <Body>{children}</Body>
      </Sheet>
    </Overlay>,
    document.body
  );
};
