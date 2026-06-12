import styled from 'styled-components';

export const ChartSection = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 24px 24px 18px;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 22px;
`;

export const ChartTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ChartSub = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.5;
`;

export const WeekSummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

export const WeekTotal = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

export const TrendBadge = styled.span<{ $up: boolean }>`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  background: ${({ $up }) => ($up ? 'rgba(34,163,90,0.12)' : 'rgba(204,34,34,0.1)')};
  color: ${({ $up }) => ($up ? '#22a35a' : '#cc2222')};
`;

export const TooltipBox = styled.div`
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 9px 13px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.07);
  pointer-events: none;
`;

export const TooltipLabel = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  letter-spacing: 0.04em;
`;

export const TooltipValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
`;

export const TooltipValueEmpty = styled(TooltipValue)`
  color: #333;
`;

export const TooltipSub = styled.div`
  font-size: 10px;
  color: #555;
  margin-top: 3px;
`;
