import styled, { css } from "styled-components";
import { SegGroup, SegBtn } from "@shared/ui/SegmentedControl";
import { CustomSelect } from "@shared/ui/CustomSelect";
import { Trigger as CustomSelectTrigger } from "@shared/ui/CustomSelect/CustomSelect.styles";
import { Btn as FieldBtnEl } from "@features/hours/components/FieldBtn.styles";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 360px) {
    gap: 8px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 360px) {
    gap: 4px;
  }
`;

export const ExportFilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 360px) {
    gap: 6px;
  }
`;

export const ExportFieldWrap = styled.div`
  flex: 1;
  min-width: 0;

  ${FieldBtnEl} {
    padding: 7px 11px;
    min-height: 44px;
    font-size: 11px;
    border-radius: 7px;
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

export const FilterUserSelect = styled(CustomSelect)`
  flex: 1;
  min-width: 90px;

  ${CustomSelectTrigger} {
    padding: 8px 11px;
    font-size: 12px;
    border-radius: 7px;
    border-color: rgba(255, 255, 255, 0.1);
    min-height: 42px;
  }

  @media (min-width: 769px) {
    flex: none;
    width: 200px;
  }
`;

export const RangeGroup = styled(SegGroup)`
  flex: 2;
  min-width: 0;
  width: 100%;
  padding: 3px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

export const RangeBtn = styled(SegBtn)`
  padding: 5px clamp(5px, 2.5vw, 13px);
  font-size: clamp(9px, 2.6vw, 11px);
  min-height: 36px;

  @media (max-width: 360px) {
    padding: 5px 4px;
  }

  @media (min-width: 769px) {
    padding: 5px 14px;
    font-size: 12px;
  }
`;

export const RowLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
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

export const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 7px 11px;
  min-height: 44px;
  border-radius: 7px;
  border: 1px solid rgba(204, 34, 34, 0.4);
  background: rgba(204, 34, 34, 0.12);
  cursor: pointer;
  color: #ff6060;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: rgba(204, 34, 34, 0.2);
    border-color: rgba(204, 34, 34, 0.55);
  }
`;
