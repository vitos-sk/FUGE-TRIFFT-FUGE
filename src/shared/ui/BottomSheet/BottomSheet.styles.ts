import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeScale = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;

  @media (min-width: 769px) {
    align-items: center;
    padding: 32px;
  }
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 600px;
  max-height: 85dvh;
  background: rgba(14, 10, 10, 0.99);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-bottom: none;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -12px 48px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 769px) {
    width: 480px;
    max-width: calc(100vw - 64px);
    max-height: 80dvh;
    border-radius: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.07);
    animation: ${fadeScale} 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const Handle = styled.div`
  flex-shrink: 0;
  width: 2.25rem;
  height: 0.25rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 0.125rem;
  margin: 0.625rem auto 0;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CloseBtn = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: rgba(255, 255, 255, 0.4);
  transition: background 0.15s, color 0.15s;
  margin-right: -0.375rem;
  flex-shrink: 0;

  &:hover { color: rgba(255, 255, 255, 0.9); background: rgba(255, 255, 255, 0.07); }
  &:active { background: rgba(255, 255, 255, 0.04); }
`;

export const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.25rem;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { width: 0.3125rem; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
`;
