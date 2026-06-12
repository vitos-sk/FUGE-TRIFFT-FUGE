import styled from 'styled-components';
import { Button } from '@shared/ui/Button';

export const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

export const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(22,22,22,0.7);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    background: rgba(28,28,28,0.8);
    border-color: rgba(255,255,255,0.1);
  }
`;

export const CheckboxInput = styled.input`
  accent-color: #22a35a;
  width: 17px;
  height: 17px;
  cursor: pointer;
  flex-shrink: 0;
`;

export const CheckText = styled.span<{ $done: boolean }>`
  flex: 1;
  font-size: 14px;
  color: ${({ $done, theme }) => ($done ? theme.colors.textMuted : theme.colors.textPrimary)};
  text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
  line-height: 1.4;
  transition: all 0.2s;
`;

export const RemoveBtn = styled(Button)`
  color: #555;
  flex-shrink: 0;
`;

export const CheckProgressBar = styled.div<{ $pct: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  margin-bottom: 16px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ theme }) => theme.colors.success};
    border-radius: 9999px;
    transition: width 0.4s ease;
  }
`;

export const CheckProgressLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

export const AddRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const AddBtn = styled(Button)`
  flex-shrink: 0;
  padding: 10px 13px;
`;

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 16px 0;
`;
