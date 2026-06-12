import styled from 'styled-components';

const inputBase = `
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  line-height: 1.4;
  outline: none;
`;

export const Input = styled.input`
  ${inputBase}
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 12px;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
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

export const Textarea = styled.textarea`
  ${inputBase}
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 14px;
  resize: vertical;
  min-height: 88px;
  font-family: inherit;
  line-height: 1.6;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:hover:not(:disabled):not(:focus) {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
`;

export const Select = styled.select`
  ${inputBase}
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 32px 6px 12px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.14);
    background-color: rgba(255, 255, 255, 0.07);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
  option { background: ${({ theme }) => theme.colors.bgCard}; }
`;
