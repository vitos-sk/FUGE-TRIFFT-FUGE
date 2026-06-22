import styled, { keyframes } from 'styled-components';

const flashHighlight = keyframes`
  0%   { border-left-color: rgba(204,34,34,0.9); background: rgba(204,34,34,0.12); }
  60%  { border-left-color: rgba(204,34,34,0.55); background: rgba(204,34,34,0.06); }
  100% { border-left-color: inherit; background: transparent; }
`;

export const Item = styled.div<{ $highlighted?: boolean; $isOwn?: boolean }>`
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 2px solid
    ${({ $isOwn, theme }) =>
      $isOwn ? theme.colors.accent : 'rgba(255,255,255,0.1)'};
  border-radius: 0 8px 8px 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-left-color ${({ theme }) => theme.transitions.fast};
  animation: ${({ $highlighted }) =>
      $highlighted ? flashHighlight : 'none'}
    0.9s ease-out;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  flex-wrap: wrap;
`;

export const Avatar = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  user-select: none;
`;

export const Author = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Time = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
`;

export const NoteText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const Actions = styled.div`
  display: flex;
  gap: 2px;
  margin-left: 6px;
  flex-shrink: 0;
`;

export const EditRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;
