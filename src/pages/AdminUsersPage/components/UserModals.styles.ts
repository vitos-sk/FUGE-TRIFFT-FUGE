import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 400px) {
    flex-direction: column-reverse;
    button {
      width: 100%;
    }
  }
`;

export const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  padding: 11px 14px;
  background: ${({ theme }) => `${theme.colors.danger}18`};
  border: 1px solid ${({ theme }) => `${theme.colors.danger}44`};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  line-height: 1.4;
`;
