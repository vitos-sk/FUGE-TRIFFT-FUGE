import styled from 'styled-components';

export const PresetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 1.25rem;
`;

export const PresetItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ $active }) => ($active ? 'rgba(204, 34, 34, 0.14)' : 'transparent')};
  font-family: inherit;
  font-size: 0.9375rem;
  text-align: left;
  transition: background 0.12s;
  color: ${({ $active }) => ($active ? '#ff6060' : 'rgba(255, 255, 255, 0.85)')};
  font-weight: ${({ $active }) => ($active ? '700' : '400')};

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(204, 34, 34, 0.2)' : 'rgba(255, 255, 255, 0.07)'};
  }
  &:active { opacity: 0.75; }
`;

export const SectionDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 1rem 0;
`;

export const SectionLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.75rem;
`;

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

export const CustomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const ConfirmBtn = styled.button`
  width: 100%;
  min-height: 2.75rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: opacity 0.15s, transform 0.15s;

  &:hover { opacity: 0.88; }
  &:active { opacity: 0.75; transform: scale(0.98); }
  &:disabled { opacity: 0.35; cursor: default; }
`;
