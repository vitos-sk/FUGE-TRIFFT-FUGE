import styled from 'styled-components';

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const PeriodLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.01em;

  @media (max-width: 560px) {
    text-align: center;
    order: 2;
  }
`;

export const SwitchWrap = styled.div`
  min-width: 320px;

  @media (max-width: 560px) {
    min-width: 0;
    order: 1;
  }
`;
