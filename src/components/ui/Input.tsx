import styled from 'styled-components';

const inputBase = `
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  line-height: 1.4;
  outline: none;
`;

export const Input = styled.input`
  ${inputBase}
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 14px;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgCard};
    box-shadow: 0 0 0 3px rgba(204,34,34,0.12);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const Textarea = styled.textarea`
  ${inputBase}
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 14px;
  resize: vertical;
  min-height: 88px;
  font-family: inherit;
  line-height: 1.6;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:hover:not(:disabled):not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgCard};
    box-shadow: 0 0 0 3px rgba(204,34,34,0.12);
  }
`;

export const Select = styled.select`
  ${inputBase}
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 36px 10px 14px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23555' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(204,34,34,0.12);
  }
  option { background: ${({ theme }) => theme.colors.bgCard}; }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Label = styled.label`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.09em;
`;
