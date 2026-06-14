import styled from 'styled-components';

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
  table-layout: auto;
`;

export const Th = styled.th<{ $hide?: boolean }>`
  padding: 11px 12px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;

  @media (max-width: 700px) {
    display: ${({ $hide }) => ($hide ? 'none' : 'table-cell')};
    padding: 10px 8px;
  }
`;

export const Td = styled.td<{ $hide?: boolean }>`
  padding: 12px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;

  @media (max-width: 700px) {
    display: ${({ $hide }) => ($hide ? 'none' : 'table-cell')};
    padding: 10px 8px;
  }
`;

export const Tr = styled.tr<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  transition: background ${({ theme }) => theme.transitions.fast};
  &:last-child td {
    border-bottom: none;
  }
  &:hover td {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const ActionCell = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
`;

export const StatusDot = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#27ae60' : '#6c757d')};
  white-space: nowrap;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
`;

export const TdBold = styled(Td)`
  font-weight: 500;
`;

export const TdMuted = styled(Td)`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const RoleBadge = styled.span<{ $isAdmin: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: ${({ $isAdmin }) => ($isAdmin ? '#c9a84c1a' : '#3498db1a')};
  color: ${({ $isAdmin }) => ($isAdmin ? '#c9a84c' : '#3498db')};
  border: 1px solid ${({ $isAdmin }) => ($isAdmin ? '#c9a84c35' : '#3498db35')};
`;
