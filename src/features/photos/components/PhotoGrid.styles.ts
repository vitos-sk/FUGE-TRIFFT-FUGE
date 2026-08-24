import styled, { keyframes } from 'styled-components';
import { glassSurface } from '../../../styles/glass';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const highlight = keyframes`
  0%   { box-shadow: 0 0 0 3px rgba(204,34,34,0.8); }
  70%  { box-shadow: 0 0 0 6px rgba(204,34,34,0.3); }
  100% { box-shadow: 0 0 0 0px rgba(204,34,34,0); }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* Date group: "Heute", "Gestern", "01. Juni 2026" */
export const DayGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DayHeading = styled.h3`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* 2 columns on mobile, 3 on tablet/desktop, 4 on wide screens */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

export const PhotoCard = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid
    ${({ $highlighted, theme }) =>
      $highlighted ? theme.colors.accent : theme.colors.border};
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  transition: border-color ${({ theme }) => theme.transitions.spring},
    box-shadow ${({ theme }) => theme.transitions.spring};
  animation: ${({ $highlighted }) => ($highlighted ? highlight : 'none')} 1.6s
    ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
  }
  &:hover img {
    transform: scale(1.04);
  }

  &:active {
    opacity: 0.9;
  }

  @media (max-width: 640px) {
    &:hover {
      box-shadow: none;
    }
    &:hover img {
      transform: none;
    }
  }
`;

export const Img = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
  animation: ${fadeIn} 0.3s ease;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
  padding: 26px 8px 8px;
  pointer-events: none;
`;

/* "17:17 · VS" — capture time and the uploader's initials */
export const StampRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  min-width: 0;
`;

export const StampDot = styled.span`
  color: rgba(255, 255, 255, 0.5);
`;

export const CardCaption = styled.p`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MenuBtn = styled.button`
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 2;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.82);
  }

  &:active {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/* Action list inside the photo BottomSheet */
export const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SheetAction = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 14px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.textPrimary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgElevated};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:active {
    opacity: 0.85;
  }
`;

/* Floating "Vorher / Nachher" pill, clear of the mobile tab bar */
export const CompareFab = styled.button<{ $active: boolean }>`
  position: fixed;
  right: 16px;
  bottom: 24px;
  z-index: 150;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.95)')};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : 'rgba(30, 30, 30, 0.92)'};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accentHover : 'rgba(255,255,255,0.12)'};
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (max-width: 768px) {
    bottom: calc(62px + env(safe-area-inset-bottom, 0px) + 16px);
  }
`;

/* ─── Lightbox ────────────────────────────────────────────────────────── */

export const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.96);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.15s ease;
  overflow: hidden;
  touch-action: pan-y;
`;

export const LightboxInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  max-width: 95vw;
  max-height: 95dvh;
  user-select: none;
`;

export const LightboxImg = styled.img`
  max-width: 95vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9);
  touch-action: pinch-zoom;
  display: block;

  @media (max-width: 640px) {
    max-height: 72dvh;
    border-radius: 4px;
  }
`;

export const LightboxClose = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.65);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    top: 12px;
    right: 12px;
  }
`;

export const LightboxFooter = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0 4px;
  min-height: 24px;

  @media (max-width: 640px) {
    margin-top: 8px;
    gap: 8px;
  }
`;

export const LightboxCaption = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const LightboxCounter = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
  margin-left: auto;
`;

export const LightboxNav = styled.button<{ $side: 'left' | 'right' }>`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => ($side === 'left' ? 'left: 16px;' : 'right: 16px;')}
  z-index: 1001;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  @media (max-width: 640px) {
    display: none;
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
