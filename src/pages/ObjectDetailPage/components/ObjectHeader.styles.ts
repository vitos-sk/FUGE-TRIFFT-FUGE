import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeroSection = styled.div`
  position: relative;
  height: 320px;
  margin: -28px -24px 0 -24px;
  background: #060303;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
    margin: -18px -16px 0 -16px;
  }
`;

export const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(6, 3, 3, 0.25) 35%,
    rgba(6, 3, 3, 0.72) 68%,
    #060303 95%
  );
  pointer-events: none;
  z-index: 1;
`;

export const HeroBack = styled(Link)`
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 8px 14px;
  text-shadow: none;
  transition: color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;

  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.22);
  }

  &:active {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.35);
  }
`;

export const HeroContent = styled.div`
  position: absolute;
  bottom: 18px;
  left: 16px;
  right: 16px;
  z-index: 2;
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.2;
  text-wrap: balance;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85), 0 1px 4px rgba(0, 0, 0, 0.6);
  margin-bottom: 7px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const HeroMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const HeroMeta = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  min-width: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  svg { flex-shrink: 0; }
`;

export const DeadlineChip = styled.span<{ $urgent: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $urgent }) =>
    $urgent ? 'rgba(204,34,34,0.22)' : 'rgba(255,255,255,0.09)'};
  border: 1px solid ${({ $urgent }) =>
    $urgent ? 'rgba(204,34,34,0.45)' : 'rgba(255,255,255,0.13)'};
  color: ${({ $urgent }) =>
    $urgent ? '#e53333' : 'rgba(255,255,255,0.65)'};
  box-shadow: ${({ $urgent }) =>
    $urgent ? '0 0 12px rgba(204,34,34,0.28)' : 'none'};
`;

/* Strip below hero — transparent glass, no solid fill */
export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 4px;
`;

export const ActionBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: 10px;
  min-height: 44px;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    opacity: 0.75;
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.35);
  }

  /* Stretch equally on mobile */
  @media (max-width: 640px) {
    flex: 1;
  }

  /* Natural width on desktop */
  @media (min-width: 641px) {
    min-width: 150px;
  }
`;
