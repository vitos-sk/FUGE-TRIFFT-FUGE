import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiWifiOff } from 'react-icons/fi';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Banner = styled.div`
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

const Dot = styled.span`
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

interface Props {
  message?: string;
}

export const OfflineBanner: React.FC<Props> = ({
  message = 'Kein Internet – Daten können nicht geladen werden',
}) => (
  <Banner>
    <FiWifiOff size={15} style={{ flexShrink: 0 }} />
    {message}
    <Dot style={{ marginLeft: 'auto' }} />
  </Banner>
);
