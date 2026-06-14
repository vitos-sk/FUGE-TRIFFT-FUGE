import styled from 'styled-components';

/* ── Ввод ставки (в subheader модала) ────────────────────────────────── */

export const RateRow = styled.div`
  padding: 10px 24px 12px;

  @media (max-width: 560px) {
    padding: 8px 16px 10px;
  }
`;

export const RateInputWrap = styled.div`
  position: relative;
`;

export const RateInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 22px;
  font-weight: 700;
  padding: 10px 52px 10px 14px;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: rgba(255, 255, 255, 0.22); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; font-weight: 400; }

  @media (max-width: 420px) {
    font-size: 18px;
    padding: 9px 44px 9px 12px;
  }
`;

export const RateSuffix = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

/* ── Итоговый блок ────────────────────────────────────────────────────── */

export const WageDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  margin: 0 0 12px;
`;

export const WageSummaryBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 10px 14px;
  margin-bottom: 14px;

  @media (max-width: 420px) {
    padding: 9px 11px;
    margin-bottom: 12px;
  }
`;

export const WageSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  & + & { margin-top: 4px; }
`;

export const WageSummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
`;

export const WageTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  padding-top: 9px;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

export const WageTotalLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const WageTotalValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;

  @media (max-width: 420px) {
    font-size: 18px;
  }
`;

/* ── Детализация по записям ───────────────────────────────────────────── */

export const WageBreakdownTitle = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
`;

export const WageBreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/* На десктопе — одна строка, на мобиле — две */
export const WageBreakdownRow = styled.div`
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255,255,255,0.02);
  display: flex;
  gap: 8px;

  /* Десктоп: всё в одну строку */
  @media (min-width: 560px) {
    flex-direction: row;
    align-items: center;
    gap: 0;
  }

  /* Мобиле: две строки */
  @media (max-width: 559px) {
    flex-direction: column;
    gap: 3px;
  }

  &:nth-child(even) { background: rgba(255,255,255,0.04); }
`;

/* Дата · время · пауза */
export const WageRowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  /* Десктоп: занимает фиксированное место, не растягивается */
  @media (min-width: 560px) {
    flex-shrink: 0;
    margin-right: 10px;
  }

  /* Мобиле: может переносить */
  @media (max-width: 559px) {
    flex-wrap: wrap;
    row-gap: 2px;
  }
`;

export const WageRowDate = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

export const WageRowTime = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
`;

export const WageRowPause = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
`;

export const WageDot = styled.span`
  font-size: 10px;
  color: rgba(255,255,255,0.18);
  flex-shrink: 0;
`;

/* Объект + часы + сумма */
export const WageRowBottom = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;

  /* Десктоп: занимает оставшееся место */
  @media (min-width: 560px) {
    flex: 1;
  }
`;

export const WageRowObj = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WageRowHours = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
  flex-shrink: 0;
`;

export const WageRowAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 68px;
  text-align: right;

  @media (max-width: 420px) {
    font-size: 12px;
    min-width: 60px;
  }
`;

/* ── Футер (в footer-слоте модала) ───────────────────────────────────── */

export const WageModalFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;

  @media (max-width: 420px) {
    flex-direction: column-reverse;
    gap: 6px;
    > * { width: 100%; justify-content: center; }
  }
`;

export const WageCopyBtn = styled.button<{ $done: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 12px;
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

  @media (max-width: 420px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;
