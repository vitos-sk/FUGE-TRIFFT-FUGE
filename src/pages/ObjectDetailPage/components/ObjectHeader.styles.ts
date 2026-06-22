import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeroSection = styled.div`
  position: relative;
  height: 220px;
  margin: -28px -24px 0 -24px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 190px;
    margin: -18px -16px 0 -16px;
  }
`;

export const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0) 25%,
    rgba(0, 0, 0, 0.55) 60%,
    rgba(0, 0, 0, 0.9) 100%
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
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
  transition: color 0.15s;
  letter-spacing: 0.01em;

  &:hover { color: #fff; }
`;

export const HeroContent = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 2;
`;

export const HeroTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-wrap: balance;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 19px;
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
  color: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  min-width: 0;
  flex: 1;

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
  text-shadow: none;
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

export const ActionBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 10px 16px;
  min-height: 44px;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.07);
  }

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    flex: 1;
    justify-content: center;
  }
`;
