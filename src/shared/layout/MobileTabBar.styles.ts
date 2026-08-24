import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glassBar } from '../../styles/glass';

export const Bar = styled.nav`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  ${glassBar};
  border-top: 1px solid ${({ theme }) => theme.glass.border};
  z-index: 200;
  padding-bottom: env(safe-area-inset-bottom);

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const TabItem = styled(Link)<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
  transition: color ${({ theme }) => theme.transitions.fast};
  position: relative;
  text-decoration: none;
`;

export const ActiveBar = styled.span<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 2px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 0 0 ${({ theme }) => theme.borderRadiusPill} ${({ theme }) => theme.borderRadiusPill};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.15s;
`;

export const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TabLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const TabIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TabBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -7px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  font-size: 8px;
  font-weight: 800;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.textMuted};
  color: ${({ theme }) => theme.colors.bgPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.bgPrimary};
`;
