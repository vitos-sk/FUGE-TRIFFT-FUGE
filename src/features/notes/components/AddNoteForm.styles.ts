import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* Relative container — send button is positioned absolutely inside */
export const ChatBar = styled.div`
  position: relative;
`;

export const ChatInput = styled.textarea`
  display: block;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  resize: none;
  outline: none;
  font-size: 15px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  min-height: 52px;
  /* Right padding reserves space for the 36px button + margins */
  padding: 14px 52px 14px 16px;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  overflow-y: hidden;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.16);
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
`;

export const CharCount = styled.span<{ $warn: boolean }>`
  position: absolute;
  right: 52px;
  bottom: 14px;
  font-size: 10px;
  color: ${({ $warn, theme }) => ($warn ? theme.colors.accent : theme.colors.textMuted)};
  pointer-events: none;
  transition: color 0.15s;
  line-height: 1;
`;

export const SendBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active }) => ($active ? '#cc2222' : '#2a2a2a')};
  color: #fff;
  transition: background 0.15s, transform 0.15s, opacity 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#e53333' : '#2a2a2a')};
    transform: ${({ $active }) => ($active ? 'scale(1.07)' : 'none')};
  }

  &:active:not(:disabled) {
    opacity: 0.75;
  }

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.35);
  }
`;

export const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
`;
