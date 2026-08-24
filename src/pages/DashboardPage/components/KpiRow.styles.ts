import styled from 'styled-components';

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const KpiCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 18px 20px 16px;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 14px 14px 12px;
  }
`;

export const KpiLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const KpiValue = styled.p`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const KpiUnit = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 5px;
  letter-spacing: 0;
`;

export const KpiFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  min-height: 18px;
  flex-wrap: wrap;
`;

export const KpiHint = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.7;
`;
