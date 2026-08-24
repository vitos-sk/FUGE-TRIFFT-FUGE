import styled from 'styled-components';

export const Panel = styled.section`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 22px 22px 18px;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 18px 16px 14px;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`;

export const PanelTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PanelSub = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
  white-space: nowrap;
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  text-align: center;
  padding: 44px 0;
`;

export const TrendBadge = styled.span<{ $up: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: ${({ theme }) => theme.borderRadiusPill};
  background: ${({ $up }) => ($up ? 'rgba(34,163,90,0.12)' : 'rgba(204,34,34,0.1)')};
  color: ${({ $up, theme }) => ($up ? theme.colors.success : theme.colors.accent)};
  white-space: nowrap;
`;

export const TooltipBox = styled.div`
  background: rgba(20, 20, 20, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 9px 13px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  pointer-events: none;
`;

export const TooltipLabel = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 5px;
  letter-spacing: 0.04em;
`;

export const TooltipValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
`;

export const TooltipSub = styled.div`
  font-size: 10px;
  color: #555;
  margin-top: 3px;
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);

  & + & {
    margin-top: 4px;
  }
`;

export const TooltipDot = styled.span<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TooltipRowValue = styled.span`
  margin-left: auto;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
`;
