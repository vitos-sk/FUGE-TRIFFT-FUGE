import styled from 'styled-components';

export const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 24px rgba(0, 0, 0, 0.5);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 374px) {
    padding: 14px 12px;
    gap: 12px;
  }

  @media (min-width: 640px) {
    max-width: 580px;
  }
`;

export const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const ErrorBox = styled.div`
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AddressPreview = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: -8px;
  padding-left: 2px;
  line-height: 1.4;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
