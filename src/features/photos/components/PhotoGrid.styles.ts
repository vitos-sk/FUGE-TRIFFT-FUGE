import styled, { keyframes } from 'styled-components';

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
  gap: 24px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
`;

export const PhotoCard = styled.div<{ $highlighted?: boolean }>`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ $highlighted, theme }) => $highlighted ? theme.colors.accent : theme.colors.border};
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all ${({ theme }) => theme.transitions.spring};
  animation: ${({ $highlighted }) => $highlighted ? highlight : 'none'} 1.6s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: 0 8px 28px rgba(0,0,0,0.5);
    transform: scale(1.02);
  }
  &:hover img { transform: scale(1.06); }
  &:hover .delete-btn { opacity: 1; }

  @media (max-width: 640px) {
    aspect-ratio: 1 / 1;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.05);
    &:hover { transform: none; box-shadow: none; }
    &:hover img { transform: none; }
  }
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
  animation: ${fadeIn} 0.3s ease;
`;

export const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.78));
  padding: 20px 10px 10px;

  @media (max-width: 640px) {
    padding: 14px 5px 5px;
  }
`;

export const Caption = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
  line-height: 1.3;

  @media (max-width: 640px) {
    display: none;
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
  background: rgba(0,0,0,0.65);
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  backdrop-filter: blur(4px);
  z-index: 10;

  &:hover { background: rgba(180,30,30,0.85); color: #fff; }

  @media (max-width: 640px) {
    opacity: 1;
    width: 26px;
    height: 26px;
    top: 4px;
    right: 4px;
  }
`;

/* ─── Lightbox ────────────────────────────────────────────────────────── */

export const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.96);
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

/* Контейнер изображения + футер — клик внутри не закрывает лайтбокс */
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
  box-shadow: 0 24px 80px rgba(0,0,0,0.9);
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
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.65);
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255,255,255,0.15);
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
  color: rgba(255,255,255,0.75);
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
  color: rgba(255,255,255,0.35);
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
  margin-left: auto;
`;

/* Стрелки навигации — видны только на десктопе, на мобиле — свайп */
export const LightboxNav = styled.button<{ $side: 'left' | 'right' }>`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => $side === 'left' ? 'left: 16px;' : 'right: 16px;'}
  z-index: 1001;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.55);
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255,255,255,0.15);
    color: #fff;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding: 40px 0;
`;
