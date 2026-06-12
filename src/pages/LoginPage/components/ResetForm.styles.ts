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

export const SuccessMsg = styled.div`
  padding: 12px 16px;
  background: rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: #4caf50;
  line-height: 1.4;
`;

export const BackLink = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 14px;
  display: block;
  text-align: center;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

export const SubmitBtn = styled(Button)`
  margin-top: 10px;
`;
