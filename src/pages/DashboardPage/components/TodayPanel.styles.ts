import styled from 'styled-components';

export const TodayGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const Headline = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  white-space: nowrap;
`;

export const HeadlineValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
`;

export const HeadlineSub = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const TodayTotal = styled.p`
  margin-top: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-variant-numeric: tabular-nums;
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const GroupLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: 2px;
`;

export const Chip = styled.span<{ $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadiusPill};
  font-size: 11px;
  font-weight: 600;
  background: ${({ $muted }) =>
    $muted ? 'rgba(255,255,255,0.04)' : 'rgba(34,163,90,0.11)'};
  border: 1px solid
    ${({ $muted }) => ($muted ? 'rgba(255,255,255,0.08)' : 'rgba(34,163,90,0.25)')};
  color: ${({ $muted, theme }) =>
    $muted ? theme.colors.textSecondary : theme.colors.success};
`;

export const ChipHours = styled.span`
  font-weight: 700;
  opacity: 0.8;
  font-variant-numeric: tabular-nums;
`;

export const ChipRow = styled.div`
  & + & {
    margin-top: 10px;
  }
`;

export const AllDone = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const WarnToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  padding: 7px 12px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.26);
  color: ${({ theme }) => theme.colors.warning};
  font-size: 11px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(217, 119, 6, 0.16);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const WarnCount = styled.span`
  margin-left: auto;
  opacity: 0.75;
`;

export const WarnList = styled.ul`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
`;

export const WarnItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 11px;
`;

export const WarnKind = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.warning};
`;

export const WarnWho = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
`;

export const WarnDetail = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const WarnDate = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;
