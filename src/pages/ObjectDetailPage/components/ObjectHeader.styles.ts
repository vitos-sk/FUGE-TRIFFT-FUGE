import styled from 'styled-components';
import { Link } from 'react-router-dom';

const statusAccents: Record<string, string> = {
  new: '#3498db',
  in_progress: '#cc2222',
  paused: '#6c757d',
  done: '#27ae60',
};

export const HeroSection = styled.div<{ $status: string }>`
  position: relative;
  height: 220px;
  margin: -28px -24px 0 -24px;
  background: ${({ $status }) => `${statusAccents[$status] || '#252525'}18`};
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

export const HeroStatusBadge = styled.div`
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 2;
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

export const HeroMeta = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  gap: 4px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);

  svg { flex-shrink: 0; }
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MapsIconBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 6px 12px;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.06);
  }
`;
