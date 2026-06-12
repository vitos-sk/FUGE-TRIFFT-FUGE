import styled from 'styled-components';
import { Button } from '@shared/ui/Button';

export const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
  letter-spacing: -0.01em;
`;

export const FormSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ErrorMsg = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
`;

export const ForgotLink = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
  display: block;
  margin-top: -6px;
  transition: color ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

export const SubmitBtn = styled(Button)`
  margin-top: 10px;
`;
