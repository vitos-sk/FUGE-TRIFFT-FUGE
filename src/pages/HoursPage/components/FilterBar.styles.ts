import styled, { css } from "styled-components";
import { SegGroup, SegBtn } from "@shared/ui/SegmentedControl";
import { MonthInput } from "@shared/ui/MonthInput";
import { CustomSelect } from "@shared/ui/CustomSelect";

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 16px rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 360px) {
    padding: 10px 10px;
    gap: 8px;
  }
`;

// Horizontal row — always single row, no wrapping
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 360px) {
    gap: 6px;
  }
`;

// Mitarbeiter dropdown — stretches to fill available space
export const FilterUserSelect = styled(CustomSelect)`
  flex: 1;
  min-width: 90px;
`;

// Zeitraum button group — compact alongside dropdown; full width when alone (non-admin)
export const RangeGroup = styled(SegGroup)`
  flex-shrink: 0;
  padding: 3px;

  &:only-child {
    flex: 1;
    width: 100%;
  }
`;

export const RangeBtn = styled(SegBtn)`
  padding: 5px 10px;
  font-size: 10px;

  @media (max-width: 480px) {
    padding: 5px 7px;
    font-size: 10px;
  }

  @media (max-width: 360px) {
    padding: 4px 5px;
    font-size: 9px;
    letter-spacing: 0;
  }
`;

// Wrapper for the "Andere" button + its dropdown
export const MonthBtnWrap = styled.div`
  position: relative;
  flex: 1;
`;

// The "Andere" picker dropdown — aligned to right edge so it never overflows
export const MonthDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 991;
  background: rgba(14, 9, 9, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(204, 34, 34, 0.3);
  border-radius: 7px;
  padding: 7px;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  min-width: 144px;
`;

export const RowLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin-bottom: 2px;
`;

export const RowGroup = styled.div<{ $elevated?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  ${({ $elevated }) =>
    $elevated &&
    css`
      position: relative;
      z-index: 1;
    `}
`;

// Export row: month input + button
export const ExportMonthInput = styled(MonthInput)`
  flex: 1;
  min-width: 0;
`;

export const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 0 14px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(204, 34, 34, 0.5);
  background: linear-gradient(135deg, rgba(204, 34, 34, 0.85), rgba(155, 18, 18, 0.85));
  cursor: pointer;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.12);
  }

  @media (max-width: 480px) {
    flex: 1;
    height: 32px;
    font-size: 11px;
  }
`;
