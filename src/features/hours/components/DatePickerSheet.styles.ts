import styled from 'styled-components';

export const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const NavBtn = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: rgba(255, 255, 255, 0.4);
  transition: background 0.13s, color 0.13s;
  flex-shrink: 0;

  &:hover { background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.85); }
  &:active { background: rgba(255, 255, 255, 0.04); }
`;

export const MonthLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  flex: 1;
`;

export const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.25rem;

  span {
    text-align: center;
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 0.25rem 0;
  }
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
  margin-bottom: 0.5rem;
`;

export const DayCell = styled.button<{
  $selected: boolean;
  $today: boolean;
  $otherMonth: boolean;
}>`
  aspect-ratio: 1;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 0.8125rem;
  font-weight: ${({ $selected, $today }) => ($selected || $today ? '700' : '400')};
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  transition: background 0.12s, color 0.12s;
  color: ${({ $selected, $today, $otherMonth, theme }) => {
    if ($selected) return '#fff';
    if ($today) return theme.colors.accent;
    if ($otherMonth) return 'rgba(255, 255, 255, 0.18)';
    return theme.colors.textPrimary;
  }};
  background: ${({ $selected, $today, theme }) => {
    if ($selected) return theme.colors.accent;
    if ($today) return `${theme.colors.accent}22`;
    return 'transparent';
  }};

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.accent : 'rgba(255, 255, 255, 0.08)'};
  }
  &:active { opacity: 0.75; }
`;
