import styled from "styled-components";
import { SegGroup, SegBtn } from "@shared/ui/SegmentedControl";
import { CustomSelect } from "@shared/ui/CustomSelect";
import { Trigger as CustomSelectTrigger } from "@shared/ui/CustomSelect/CustomSelect.styles";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
`;

export const SectionHead = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
`;

export const FilterUserSelect = styled(CustomSelect)`
  width: 100%;

  ${CustomSelectTrigger} {
    padding: 10px 13px;
    font-size: 13px;
    border-radius: 8px;
    border-color: rgba(255, 255, 255, 0.1);
    min-height: 46px;
  }
`;

export const RangeGroup = styled(SegGroup)`
  width: 100%;
  padding: 3px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

export const RangeBtn = styled(SegBtn)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 5px 8px;
  font-size: 12px;

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }

  @media (max-width: 360px) {
    font-size: 11px;
    gap: 4px;
    padding: 5px 4px;
  }
`;

/** "Anderer Monat" auf breiten, "Andere" auf schmalen Displays. */
export const RangeBtnLabel = styled.span`
  @media (max-width: 420px) {
    display: none;
  }
`;

export const RangeBtnLabelShort = styled.span`
  @media (min-width: 421px) {
    display: none;
  }
`;

export const PeriodRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 46px;
  padding: 8px 13px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
  }

  > svg {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const PeriodText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-variant-numeric: tabular-nums;
`;

export const PeriodAction = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #ff6060;
`;

export const ExportRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

export const ExportMonthBtn = styled(PeriodRow)`
  min-width: 0;
`;

export const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 46px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(204, 34, 34, 0.4);
  background: rgba(204, 34, 34, 0.12);
  cursor: pointer;
  color: #ff6060;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: rgba(204, 34, 34, 0.2);
    border-color: rgba(204, 34, 34, 0.55);
  }
`;
