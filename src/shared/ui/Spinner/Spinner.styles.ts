import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ size?: number }>`
  width: ${({ size = 24 }) => size}px;
  height: ${({ size = 24 }) => size}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.65s linear infinite;
  flex-shrink: 0;
`;

export const FullPageSpinner = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgPrimary};
`;
