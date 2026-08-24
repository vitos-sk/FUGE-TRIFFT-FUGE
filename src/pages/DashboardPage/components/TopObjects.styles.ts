import styled from 'styled-components';

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
`;

export const Row = styled.li<{ $clickable: boolean }>`
  display: grid;
  grid-template-columns: 18px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 9px 8px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $clickable }) => ($clickable ? 'rgba(255,255,255,0.05)' : 'transparent')};
  }
`;

export const Rank = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const Main = styled.div`
  min-width: 0;
`;

export const Title = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Meta = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BarTrack = styled.div`
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);
  margin-top: 7px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => Math.max($pct, 1)}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
`;

export const Values = styled.div`
  text-align: right;
  white-space: nowrap;
`;

export const Hours = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

export const Share = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 3px;
  font-variant-numeric: tabular-nums;
`;

export const MoreBtn = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
