import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      document.documentElement.style.overflowY = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalBox width={width} $height={height}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onClose} aria-label="Schließen"><FiX size={16} /></CloseBtn>
        </ModalHeader>
        {subheader && <ModalSubheader>{subheader}</ModalSubheader>}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooterRow>{footer}</ModalFooterRow>}
      </ModalBox>
    </Overlay>
  );
};
