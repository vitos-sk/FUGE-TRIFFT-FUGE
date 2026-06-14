import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.18s ease;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

export const ModalBox = styled.div<{ width?: string; $height?: string }>`
  background: rgba(10, 7, 7, 0.5);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(204, 34, 34, 0.35);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  width: 100%;
  max-width: min(${({ width }) => width || '480px'}, calc(100vw - 40px));
  max-height: 90dvh;

  @media (min-width: 768px) {
    max-width: min(${({ width }) => width || '480px'}, calc(100vw - 64px));
  }
  ${({ $height }) => $height && `height: ${$height};`}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideIn} 0.22s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  background: rgba(10, 7, 7, 0.97);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
`;

export const ModalTitle = styled.h2`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const CloseBtn = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  line-height: 1;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.07);
  }
  &:active {
    background: rgba(255,255,255,0.04);
  }
`;

export const ModalSubheader = styled.div`
  flex-shrink: 0;
  background: rgba(8, 5, 5, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ModalFooterRow = styled.div`
  flex-shrink: 0;
  background: rgba(8, 5, 5, 1);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 24px 18px;

  @media (max-width: 560px) {
    padding: 10px 16px 14px;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;

  @media (max-width: 560px) {
    padding: 16px;
  }

  &::-webkit-scrollbar { width: 5px; height: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.13);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.22); }
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.13) transparent;
`;
