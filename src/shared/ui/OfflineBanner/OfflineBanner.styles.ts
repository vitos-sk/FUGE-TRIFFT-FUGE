import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  background: rgba(255, 170, 0, 0.07);
  border: 1px solid rgba(255, 170, 0, 0.22);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  font-weight: 500;
  color: #f0a800;
  line-height: 1.4;
  animation: ${slideIn} 0.2s ease;
  margin-bottom: 16px;
`;

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f0a800;
  flex-shrink: 0;
  animation: pulse 1.6s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
`;
