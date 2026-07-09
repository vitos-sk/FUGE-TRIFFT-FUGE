import styled from 'styled-components';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CompareContainer = styled.div.attrs({ 'data-compare-slider': true })`
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

export const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  backdrop-filter: blur(4px);
  z-index: 10;

  &:hover {
    background: rgba(180, 30, 30, 0.85);
    color: #fff;
  }

  &:active {
    background: rgba(180, 30, 30, 0.85);
    color: #fff;
    transform: scale(0.9);
  }
`;

export const Meta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0 2px;
`;
