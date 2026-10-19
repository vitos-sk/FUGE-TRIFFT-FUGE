import styled from 'styled-components';
import { Input } from '@shared/ui/Input';

const PHONE = '@media (max-width: 768px)';

export const Screen = styled.form`
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* room for the fixed save button above the tab bar */
  ${PHONE} {
    padding-bottom: 84px;
  }
`;

/** "Montag, 19. Oktober" — dotted underline marks it as tappable (opens the calendar). */
export const DateLink = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin-top: -8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;

  span {
    border-bottom: 1px dotted rgba(255, 255, 255, 0.55);
    padding-bottom: 1px;
  }

  svg {
    opacity: 0.6;
  }
`;

type NoticeTone = 'error' | 'warn';

export const Notice = styled.div<{ $tone: NoticeTone }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  line-height: 1.4;
  color: ${({ $tone, theme }) => ($tone === 'error' ? theme.colors.accent : '#f0a800')};
  background: ${({ $tone, theme }) =>
    $tone === 'error' ? theme.colors.accentDim : 'rgba(255, 180, 0, 0.08)'};
  border: 1px solid
    ${({ $tone, theme }) => ($tone === 'error' ? `${theme.colors.accent}44` : 'rgba(255, 180, 0, 0.25)')};

  svg {
    flex-shrink: 0;
  }
`;

export const ObjectRow = styled.button`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const RowTexts = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const RowValue = styled.span<{ $empty?: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: ${({ $empty }) => ($empty ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.92)')};
`;

export const RowChevron = styled.span`
  display: flex;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.4);
`;

export const PlaceBlock = styled.div`
  padding: 12px 14px 14px;
`;

export const PlaceHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;

  label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
  }
`;

export const Counter = styled.span<{ $warn: boolean }>`
  font-size: 11px;
  color: ${({ $warn, theme }) => ($warn ? theme.colors.accent : 'rgba(255, 255, 255, 0.35)')};
  font-variant-numeric: tabular-nums;
`;

export const PlaceInput = styled(Input)`
  /* 16px prevents the auto-zoom in iOS Safari */
  font-size: 16px;
  min-height: 48px;
  padding: 10px 12px;
`;

export const TimeBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const BreakBody = styled.div`
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BreakHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const NetTime = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;

  strong {
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Chips = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(58px, 1fr));
  gap: 6px;
`;

export const Chip = styled.button<{ $active: boolean }>`
  min-height: 44px;
  padding: 0 6px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.12s,
    border-color 0.12s;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.75)')};
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : 'rgba(255, 255, 255, 0.16)')};

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.accentHover : 'rgba(255, 255, 255, 0.06)')};
  }
`;

export const FieldError = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.accent};
`;

/** Main action: pinned above the tab bar on phones, below the cards on desktop. */
export const Footer = styled.div`
  margin-top: 4px;

  ${PHONE} {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(62px + env(safe-area-inset-bottom, 0px));
    z-index: 150;
    margin-top: 0;
    padding: 12px 16px;
    background: ${({ theme }) => theme.glass.barFill};
    backdrop-filter: ${({ theme }) => theme.glass.barBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.glass.barBlur};
    border-top: 1px dashed rgba(255, 255, 255, 0.18);
  }
`;

export const SkeletonCard = styled.div`
  height: 120px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
`;

export const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const LongShiftText = styled.p`
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;

  strong {
    display: block;
    margin: 10px 0 4px;
    font-size: 20px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.accent};
    font-variant-numeric: tabular-nums;
  }
`;
