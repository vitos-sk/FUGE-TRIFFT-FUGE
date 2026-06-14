import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoaderIcon = styled.div`
  width: 26px;
  height: 26px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

export const LoaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 28px 0;
`;

export const LoaderFullPage = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgPrimary};
  z-index: 9999;
`;
