import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th<{ $align?: 'left' | 'right'; $hideMobile?: boolean }>`
  text-align: ${({ $align }) => $align ?? 'left'};
  padding: 0 8px 9px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;

  @media (max-width: 620px) {
    display: ${({ $hideMobile }) => ($hideMobile ? 'none' : 'table-cell')};
  }
`;

export const SortBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textSecondary : 'inherit'};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    opacity: ${({ $active }) => ($active ? 1 : 0.25)};
  }
`;

export const Tr = styled.tr`
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

export const Td = styled.td<{ $align?: 'left' | 'right'; $hideMobile?: boolean }>`
  text-align: ${({ $align }) => $align ?? 'left'};
  padding: 11px 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  @media (max-width: 620px) {
    display: ${({ $hideMobile }) => ($hideMobile ? 'none' : 'table-cell')};
  }
`;

export const NameCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  max-width: 0;
  width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HoursCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
  font-size: 13px;
`;
