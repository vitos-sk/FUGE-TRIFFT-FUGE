import styled, { css } from 'styled-components';

interface InvalidProp {
  $invalid?: boolean;
}

const inputBase = `
  font-size: 13px;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  line-height: 1.4;
  outline: none;
`;

const invalidState = css<InvalidProp>`
  ${({ $invalid, theme }) => $invalid && css`
    border-color: ${theme.colors.danger}99;
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 0 1px ${theme.colors.danger}55;
    }
  `}
`;

export const Input = styled.input<InvalidProp>`
  ${inputBase}
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 12px;

  &::placeholder { color: ${({ theme }) => theme.colors.textPlaceholder}; }
  &:hover:not(:disabled):not(:focus) {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  ${invalidState}

  &[type="date"]::-webkit-calendar-picker-indicator,
  &[type="month"]::-webkit-calendar-picker-indicator,
  &[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(30%) sepia(80%) saturate(600%) hue-rotate(320deg) brightness(1.1);
    width: 18px;
    height: 18px;
    cursor: pointer;
    opacity: 0.85;
    &:hover { opacity: 1; }
  }
`;

export const Textarea = styled.textarea<InvalidProp>`
  ${inputBase}
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 14px;
  resize: vertical;
  min-height: 88px;
  font-family: inherit;
  line-height: 1.6;

  &::placeholder { color: ${({ theme }) => theme.colors.textPlaceholder}; }
  &:hover:not(:disabled):not(:focus) {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  ${invalidState}
`;

export const Select = styled.select<InvalidProp>`
  ${inputBase}
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 32px 6px 12px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:hover:not(:disabled):not(:focus) {
    border-color: rgba(255, 255, 255, 0.14);
    background-color: rgba(255, 255, 255, 0.07);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  ${invalidState}
  option { background: ${({ theme }) => theme.colors.bgCard}; }
`;
