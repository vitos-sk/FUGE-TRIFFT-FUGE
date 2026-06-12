import styled from 'styled-components';

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const InfoItem = styled.div`
  padding: 14px 16px;
  background: rgba(22,22,22,0.7);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
`;

export const InfoItemWide = styled(InfoItem)`
  grid-column: 1 / -1;
`;

export const InfoLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CopyBtn = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

export const DangerZone = styled.div`
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DangerTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;
