import styled from 'styled-components';

export const Scroller = styled.div`
  overflow-x: auto;
  margin: 0 -6px;
  padding: 0 6px 4px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
  }
`;

export const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: 108px repeat(${({ $cols }) => $cols}, minmax(14px, 1fr));
  gap: 3px;
  align-items: center;
  min-width: ${({ $cols }) => 108 + $cols * 17}px;

  @media (max-width: 480px) {
    grid-template-columns: 84px repeat(${({ $cols }) => $cols}, minmax(14px, 1fr));
  }
`;

export const CornerCell = styled.div`
  height: 18px;
`;

export const ColLabel = styled.div<{ $current: boolean }>`
  font-size: 9px;
  text-align: center;
  color: ${({ $current, theme }) =>
    $current ? theme.colors.accent : theme.colors.textMuted};
  font-weight: ${({ $current }) => ($current ? 700 : 500)};
  white-space: nowrap;
  overflow: hidden;
  height: 18px;
  line-height: 18px;
`;

export const RowLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 6px;
`;

export const Cell = styled.div<{ $level: number; $future: boolean }>`
  height: 22px;
  border-radius: 3px;
  background: ${({ $level }) =>
    [
      'rgba(255,255,255,0.035)',
      'rgba(204,34,34,0.22)',
      'rgba(204,34,34,0.42)',
      'rgba(204,34,34,0.66)',
      'rgba(204,34,34,0.95)',
    ][$level]};
  opacity: ${({ $future }) => ($future ? 0.35 : 1)};
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.12);
  }
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 14px;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LegendCell = styled.span<{ $level: number }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $level }) =>
    [
      'rgba(255,255,255,0.035)',
      'rgba(204,34,34,0.22)',
      'rgba(204,34,34,0.42)',
      'rgba(204,34,34,0.66)',
      'rgba(204,34,34,0.95)',
    ][$level]};
`;
