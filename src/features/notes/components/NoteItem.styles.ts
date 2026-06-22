import styled, { keyframes } from 'styled-components';

const flashHighlight = keyframes`
  0%   { background: rgba(204,34,34,0.18); }
  60%  { background: rgba(204,34,34,0.10); }
  100% { background: transparent; }
`;

export const Item = styled.div<{ $highlighted?: boolean }>`
  padding: 14px 16px 14px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 2px solid transparent;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    border-left-color ${({ theme }) => theme.transitions.fast};
  animation: ${({ $highlighted }) => $highlighted ? flashHighlight : 'none'} 0.9s ease-out;

  &:last-child { border-bottom: none; }
  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-left-color: rgba(255, 255, 255, 0.1);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
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
