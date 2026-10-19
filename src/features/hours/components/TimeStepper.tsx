import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';
import { Caption } from './hoursUi.styles';

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  gap: 4px;
`;

const Arrow = styled.button<{ $invalid: boolean }>`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ $invalid, theme }) => ($invalid ? theme.colors.accent : 'rgba(255, 255, 255, 0.12)')};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }
  &:active {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Value = styled.button<{ $invalid: boolean }>`
  min-height: 52px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ $invalid, theme }) => ($invalid ? theme.colors.accent : 'rgba(255, 255, 255, 0.12)')};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

interface Props {
  label: string;
  value: string;
  /** Highlighted red while the shift length is not valid. */
  invalid: boolean;
  /** Arrow: move by one step (15 minutes). */
  onNudge: (dir: 1 | -1) => void;
  /** Tap on the time: open the time picker. */
  onOpen: () => void;
}

/** ‹ 07:00 ›  — arrows move by 15 minutes, a tap on the time opens the picker. */
export const TimeStepper: React.FC<Props> = ({ label, value, invalid, onNudge, onOpen }) => (
  <Col>
    <Caption>{label}</Caption>
    <Row>
      <Arrow type="button" $invalid={invalid} onClick={() => onNudge(-1)} aria-label={`${label} 15 Minuten früher`}>
        <FiChevronLeft size={18} />
      </Arrow>
      <Value type="button" $invalid={invalid} onClick={onOpen} aria-label={`${label}: ${value} Uhr, ändern`}>
        {value}
      </Value>
      <Arrow type="button" $invalid={invalid} onClick={() => onNudge(1)} aria-label={`${label} 15 Minuten später`}>
        <FiChevronRight size={18} />
      </Arrow>
    </Row>
  </Col>
);
