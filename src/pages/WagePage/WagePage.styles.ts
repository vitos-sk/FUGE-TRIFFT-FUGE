import styled from 'styled-components';
import { Input } from '@shared/ui/Input';

export const Screen = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Params = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
  }
`;

export const RateInput = styled(Input)`
  /* 16px prevents the auto-zoom in iOS Safari */
  font-size: 16px;
  min-height: 52px;
  padding: 10px 12px;
  font-variant-numeric: tabular-nums;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
`;

export const Stat = styled.div<{ $right?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};

  span:first-child {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
  }
`;

export const Big = styled.span<{ $muted?: boolean }>`
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  color: ${({ $muted, theme }) => ($muted ? 'rgba(255, 255, 255, 0.3)' : theme.colors.accent)};
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const ReportBody = styled.div`
  padding: 14px;
`;

/** The exact text that Copy / Share sends. It grows with its content, no inner scrolling. */
export const ReportText = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: rgba(255, 255, 255, 0.82);
  font-variant-numeric: tabular-nums;
`;

export const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.5);
`;

export const SkeletonLine = styled.div<{ $w: string }>`
  height: 12px;
  width: ${({ $w }) => $w};
  max-width: 100%;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.06);

  & + & {
    margin-top: 10px;
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  button {
    min-height: 44px;
  }
`;
