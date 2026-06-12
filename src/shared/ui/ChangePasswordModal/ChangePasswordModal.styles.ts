import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  padding: 2px;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

export const ErrorMsg = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

export const SuccessMsg = styled.p`
  font-size: 12px;
  color: #4caf50;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`;

export const Btn = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: 9px 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.colors.accent};
    color: #fff;
    border: 1px solid ${theme.colors.accent};
    &:hover:not(:disabled) { opacity: 0.85; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  `
      : `
    background: transparent;
    color: ${theme.colors.textSecondary};
    border: 1px solid ${theme.colors.border};
    &:hover { border-color: ${theme.colors.borderHover}; color: ${theme.colors.textPrimary}; }
  `}
`;
