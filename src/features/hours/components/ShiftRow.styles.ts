import styled from 'styled-components';
import { controlHeight } from './hoursUi.styles';

export const Item = styled.li`
  border-top: 1px dashed rgba(255, 255, 255, 0.1);

  &:first-child {
    border-top: 0;
  }
`;

export const Head = styled.button<{ $open: boolean }>`
  ${controlHeight}
  width: 100%;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto 46px 16px;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  background: ${({ $open }) => ($open ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  transition: background 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset ${({ theme }) => theme.shadows.focus};
  }

  @media (max-width: 359px) {
    grid-template-columns: 40px minmax(0, 1fr) auto 40px 14px;
    gap: 6px;
    padding: 0 8px;
  }
`;

export const Day = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  b {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 700;
  }
`;

export const Who = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

export const Time = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  @media (max-width: 359px) {
    font-size: 11px;
  }
`;

export const Hours = styled.span`
  text-align: right;
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  font-variant-numeric: tabular-nums;
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.18s;
  transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
`;

export const Details = styled.div`
  padding: 4px 12px 12px;
  background: rgba(255, 255, 255, 0.05);
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 6px 12px;
  margin: 0;
  font-size: 13px;

  dt {
    color: rgba(255, 255, 255, 0.4);
  }

  dd {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;
