import styled from 'styled-components';

export const YearNav = styled.div`
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

export const YearLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  flex: 1;
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`;

export const MonthCell = styled.button<{ $selected: boolean; $current: boolean }>`
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 0.875rem;
  font-weight: ${({ $selected, $current }) => ($selected || $current ? '700' : '400')};
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
  color: ${({ $selected, $current, theme }) => {
    if ($selected) return '#fff';
    if ($current) return theme.colors.accent;
    return theme.colors.textPrimary;
  }};
  background: ${({ $selected, $current, theme }) => {
    if ($selected) return theme.colors.accent;
    if ($current) return `${theme.colors.accent}22`;
    return 'transparent';
  }};

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.accent : 'rgba(255, 255, 255, 0.08)'};
  }
  &:active { opacity: 0.75; }
`;
