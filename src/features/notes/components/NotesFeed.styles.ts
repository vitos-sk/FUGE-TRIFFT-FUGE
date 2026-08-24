import styled from 'styled-components';
import { glassSurface } from '../../../styles/glass';

/* Desktop: a readable chat column instead of a 1400px-wide stretch */
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: 769px) {
    max-width: 860px;
    /* Fill the rest of the viewport so the composer sits at the bottom
       instead of floating right under a short conversation */
    min-height: max(320px, calc(100dvh - 330px));
  }
`;

export const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* Centered day divider: "Heute" / "Gestern" / "01. Juni 2026" */
export const DayDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.glass.border};
  }
`;

/* Message input sticks above the mobile tab bar while scrolling the chat */
export const Composer = styled.div`
  position: sticky;
  bottom: 8px;
  margin-top: auto;
  z-index: 100;
  padding-top: 10px;
  /* Veil, not a wall: messages stay visible through the frosted input */
  background: linear-gradient(
    to bottom,
    rgba(8, 4, 4, 0) 0%,
    rgba(8, 4, 4, 0.42) 30%,
    rgba(8, 4, 4, 0.6) 100%
  );

  @media (max-width: 768px) {
    bottom: calc(62px + env(safe-area-inset-bottom, 0px) + 8px);
  }
`;

export const Empty = styled.div`
  text-align: center;
  padding: 36px 16px;
  ${glassSurface};
  border-style: dashed;
  border-radius: 14px;
`;

export const EmptyTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptyHint = styled.p`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
`;
