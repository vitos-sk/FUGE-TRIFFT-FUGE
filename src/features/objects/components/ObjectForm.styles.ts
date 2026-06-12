import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const AddressWrap = styled.div`
  position: relative;
`;

export const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
  background: #1c1c1c;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.65);
  z-index: 99999;
  list-style: none;
  padding: 4px 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
`;

export const SuggestionItem = styled.li`
  padding: 9px 14px;
  cursor: pointer;
  transition: background 0.1s;
  & + & { border-top: 1px solid rgba(255,255,255,0.04); }
  &:hover { background: rgba(255,255,255,0.07); }
`;

export const SuggMain = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SuggSub = styled.span`
  display: block;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1px;
`;

export const Hint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: -4px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;
