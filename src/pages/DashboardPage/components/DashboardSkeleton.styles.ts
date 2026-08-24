import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.85; }
`;

export const Block = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

export const Row = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: ${({ $cols }) => ($cols === 4 ? 'repeat(2, 1fr)' : '1fr')};
  }
`;
