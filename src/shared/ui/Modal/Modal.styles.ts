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
  padding: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.18s ease;
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
  max-width: ${({ width }) => width || '480px'};
  max-height: 90vh;
  ${({ $height }) => $height && `height: ${$height};`}
  overflow-y: auto;
  overflow-x: hidden;
  animation: ${slideIn} 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  /* Тонкий скроллбар */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.13);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.22); }
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.13) transparent;

  @media (max-width: 600px) {
    max-height: 90dvh;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  /* Прибит к верху при скролле */
  position: sticky;
  top: 0;
  z-index: 10;
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

export const ModalBody = styled.div`
  padding: 24px;
`;
