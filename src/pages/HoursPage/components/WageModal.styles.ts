import styled from 'styled-components';

export const RateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(10, 7, 7, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding-bottom: 16px;
  padding-top: 2px;
`;

export const RateInputWrap = styled.div`
  position: relative;
  flex: 1;
`;

export const RateInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 22px;
  font-weight: 700;
  padding: 10px 46px 10px 14px;
  outline: none;
  &:focus { border-color: rgba(255,255,255,0.22); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; font-weight: 400; }
`;

export const RateSuffix = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

export const WageDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  margin: 0 0 18px;
`;

export const WageSummaryBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 16px;
  margin-bottom: 20px;
`;

export const WageSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  & + & { margin-top: 6px; }
`;

export const WageSummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const WageTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

export const WageTotalLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const WageTotalValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;
`;

export const WageBreakdownTitle = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
`;

export const WageBreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
`;

export const WageBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255,255,255,0.02);
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:nth-child(even) { background: rgba(255,255,255,0.04); }
`;

export const WageRowLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

export const WageRowDate = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

export const WageRowObj = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

export const WageRowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
`;

export const WageRowHours = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const WageRowAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const WageModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: rgba(10, 7, 7, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 12px 0 2px;
  margin-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const WageCopyBtn = styled.button<{ $done: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: 1px solid ${({ $done }) => $done ? 'rgba(34,163,90,0.4)' : 'rgba(255,255,255,0.12)'};
  background: ${({ $done }) => $done ? 'rgba(34,163,90,0.08)' : 'rgba(255,255,255,0.04)'};
  color: ${({ $done }) => $done ? '#22a35a' : '#ccc'};
  transition: all 0.15s;
  cursor: pointer;
  &:hover {
    border-color: ${({ $done }) => $done ? 'rgba(34,163,90,0.4)' : 'rgba(255,255,255,0.22)'};
    color: ${({ $done }) => $done ? '#22a35a' : '#fff'};
  }
`;
