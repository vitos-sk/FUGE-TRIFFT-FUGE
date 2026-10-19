import React from 'react';
import styled from 'styled-components';
import { timeToMinutes } from '../utils/timeUtils';

const DAY = 24 * 60;
const MARKS = [0, 6, 8, 12, 16, 18, 24];

const pct = (mins: number) => `${(mins / DAY) * 100}%`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
`;

const Track = styled.div`
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

// Position and size depend on the shift, so they go through attrs (no class per value)
const Band = styled.span.attrs<{ $from: number; $to: number }>(({ $from, $to }) => ({
  style: { left: pct($from), width: pct($to - $from) },
}))`
  position: absolute;
  top: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.accent};
`;

const Marks = styled.div`
  position: relative;
  height: 14px;
`;

const Mark = styled.span.attrs<{ $at: number }>(({ $at }) => ({
  style: { left: pct($at * 60) },
}))`
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-size: 10px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;

  &:first-child {
    transform: none;
  }
  &:last-child {
    transform: translateX(-100%);
  }
`;

interface Props {
  start: string;
  end: string;
}

/** 24-hour ruler (marks at 6, 8, 12, 16, 18) with the shift drawn as a band. */
export const DayScale: React.FC<Props> = ({ start, end }) => {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  const overnight = e <= s; // e.g. 22:00 → 06:00 wraps past midnight

  return (
    <Wrap role="img" aria-label={`Schicht von ${start} bis ${end} Uhr`}>
      <Track>
        {overnight ? (
          <>
            <Band $from={s} $to={DAY} />
            <Band $from={0} $to={e} />
          </>
        ) : (
          <Band $from={s} $to={e} />
        )}
      </Track>
      <Marks aria-hidden="true">
        {MARKS.map((h) => (
          <Mark key={h} $at={h}>
            {h}
          </Mark>
        ))}
      </Marks>
    </Wrap>
  );
};
