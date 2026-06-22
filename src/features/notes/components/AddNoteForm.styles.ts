import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ChatBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 6px 6px 6px 16px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

export const ChatInput = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  resize: none;
  font-size: 14px;

  &:focus,
  &:focus-visible {
    box-shadow: none;
    outline: none;
  }
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  min-height: 22px;
  max-height: 120px;
  padding: 5px 0;
  overflow-y: auto;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const CharCount = styled.span<{ $warn: boolean }>`
  font-size: 10px;
  color: ${({ $warn, theme }) => ($warn ? theme.colors.accent : theme.colors.textMuted)};
  align-self: flex-end;
  padding-bottom: 10px;
  flex-shrink: 0;
  transition: color 0.15s;
`;

export const SendBtn = styled.button<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : "rgba(255,255,255,0.05)"};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255,255,255,0.25)")};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    transform: scale(1.07);
  }
  &:disabled {
    cursor: default;
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
