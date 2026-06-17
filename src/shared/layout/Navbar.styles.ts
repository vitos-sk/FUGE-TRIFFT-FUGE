import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(10, 10, 10, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 58px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 0;
`;

export const Logo = styled(Link)`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: 36px;
  gap: 2px;
  flex: 1;

  @media (max-width: 768px) { display: none; }
  @media (min-width: 769px) and (max-width: 900px) { margin-left: 12px; }
`;

export const NavItem = styled(NavLink)`
  padding: 6px 13px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.08em;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-transform: uppercase;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.06);
  }
  &.active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 6px;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

export const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.borderRadiusPill};
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 900px) { display: none; }
`;

export const MobileAvatar = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }
`;

export const Avatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.04em;
  flex-shrink: 0;
`;

export const UserName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

export const LogoutBtn = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent}33;
    background: ${({ theme }) => theme.colors.accentDim};
  }

  @media (max-width: 480px) { display: none; }
`;

export const MenuLogoutItem = styled.button`
  display: none;

  @media (max-width: 480px) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 16px;
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.accent};
    background: transparent;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    transition: background ${({ theme }) => theme.transitions.fast};
    text-align: left;

    &:hover { background: rgba(255,255,255,0.05); }
  }
`;

export const MenuAnchor = styled.div`
  position: relative;
`;

export const SettingsBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ $active, theme }) => $active ? theme.colors.accentDim : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textSecondary};

  /* Desktop: text label */
  padding: 6px 13px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.06);
  }

  .settings-label {
    @media (max-width: 900px) { display: none; }
  }

  /* Compact: icon only, square */
  @media (max-width: 900px) {
    padding: 0;
    width: 34px;
    height: 34px;
    justify-content: center;
    border-color: ${({ $active, theme }) => $active ? theme.colors.accent + '44' : 'transparent'};
  }
`;

export const DropMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 190px;
  background: rgba(16, 16, 16, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 28px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
  overflow: hidden;
  z-index: 300;
`;

export const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast},
              color ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.border}; }
`;

export const MenuItemLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-decoration: none;
  transition: background ${({ theme }) => theme.transitions.fast},
              color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255,255,255,0.05);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const MenuBadge = styled.span`
  margin-left: auto;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 800;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;
