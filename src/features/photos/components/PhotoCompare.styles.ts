import styled from 'styled-components';

export const CompareWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CompareContainer = styled.div`
  --slider-pos: 50%;
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: #080808;
  cursor: col-resize;
  touch-action: none;
  user-select: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CompareImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
`;

export const CompareAfterImg = styled(CompareImg)`
  z-index: 0;
`;

export const CompareBeforeImg = styled(CompareImg)`
  clip-path: polygon(0 0, var(--slider-pos) 0, var(--slider-pos) 100%, 0 100%);
  z-index: 1;
`;

export const CompareLabel = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 12px;
  ${({ $side }) => $side === 'left' ? 'left: 12px;' : 'right: 12px;'}
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 4px 9px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 5;
`;

export const CompareDivider = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--slider-pos);
  transform: translateX(-50%);
  width: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: col-resize;
  z-index: 10;
  pointer-events: none;

  @media (max-width: 640px) {
    width: 60px;
  }
`;

export const DividerLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.7), 0 0 0 0.5px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

export const DividerKnob = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  box-shadow:
    0 2px 14px rgba(0, 0, 0, 0.6),
    0 0 0 2px rgba(255, 255, 255, 0.25);
  z-index: 1;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 44px;
    height: 44px;
  }
`;

export const ThumbSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ThumbGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const ThumbGroupLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ThumbRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const ThumbImg = styled.img<{ $active: boolean }>`
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.accent : 'rgba(255,255,255,0.1)'};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.15s, border-color 0.15s;

  &:hover {
    opacity: 1;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const CompareEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  gap: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const CompareEmptyTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CompareEmptyHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;
