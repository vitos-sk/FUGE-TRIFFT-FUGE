import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiPower, FiLock, FiInbox, FiSliders } from 'react-icons/fi';
import { logoutUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useArchivedCount } from '@features/objects/hooks/useObjects';
import { NotifBell } from '@features/notifications/components/NotifBell';
import { ChangePasswordModal } from '../ui/ChangePasswordModal';

const Nav = styled.nav`
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

const Logo = styled(Link)`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: 36px;
  gap: 2px;
  flex: 1;

  @media (max-width: 768px) { display: none; }
`;

const NavItem = styled(NavLink)`
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

const Divider = styled.div`
  width: 1px;
  height: 18px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 6px;
`;


const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusPill};
  background: ${({ theme }) => theme.colors.bgCard};

  @media (max-width: 768px) { display: none; }
`;

const MobileAvatar = styled.div`
  display: none;

  @media (max-width: 768px) {
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

const Avatar = styled.div`
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

const UserName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const LogoutBtn = styled.button`
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
`;

// ─── Settings button + dropdown ────────────────────────────────────────────────

const MenuAnchor = styled.div`
  position: relative;
`;

const SettingsBtn = styled.button<{ $active?: boolean }>`
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
    @media (max-width: 768px) { display: none; }
  }

  /* Mobile: icon only, square */
  @media (max-width: 768px) {
    padding: 0;
    width: 34px;
    height: 34px;
    justify-content: center;
    border-color: ${({ $active, theme }) => $active ? theme.colors.accent + '44' : 'transparent'};
  }
`;

const DropMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 190px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 28px rgba(0,0,0,0.55);
  overflow: hidden;
  z-index: 300;
`;

const MenuItem = styled.button`
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

const MenuItemLink = styled(Link)`
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

const MenuBadge = styled.span`
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

export const Navbar: React.FC = () => {
  const { user, uid, isAdmin } = useAuth();
  const navigate = useNavigate();
  const archivedCount = useArchivedCount();
  const [showPwModal, setShowPwModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const openPw = () => {
    setShowMenu(false);
    setShowPwModal(true);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
    <Nav>
      <Logo to="/">
        FUGE <span>TRIFFT</span> FUGE
      </Logo>

      <NavLinks>
        <NavItem to="/hours">Stunden</NavItem>
        <NavItem to="/objects">Objekte</NavItem>
        {isAdmin && (
          <>
            <Divider />
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/admin/users">Benutzer</NavItem>
          </>
        )}
      </NavLinks>

      <NavRight>
        {uid && <NotifBell uid={uid} />}

        <UserChip>
          <Avatar>{initials}</Avatar>
          <UserName>{user?.name?.split(' ')[0]}</UserName>
        </UserChip>

        <MenuAnchor ref={menuRef}>
          <SettingsBtn $active={showMenu} onClick={() => setShowMenu((v) => !v)} title="Einstellungen">
            <FiSliders size={15} />
            <span className="settings-label">Einstellungen</span>
          </SettingsBtn>

          {showMenu && (
            <DropMenu>
              <MenuItem onClick={openPw}>
                <FiLock size={14} />
                Passwort ändern
              </MenuItem>
              {isAdmin && (
                <MenuItemLink to="/archiv" onClick={() => setShowMenu(false)}>
                  <FiInbox size={14} />
                  Archiv
                  {archivedCount > 0 && <MenuBadge>{archivedCount}</MenuBadge>}
                </MenuItemLink>
              )}
            </DropMenu>
          )}
        </MenuAnchor>

        <MobileAvatar>{initials}</MobileAvatar>

        <LogoutBtn onClick={handleLogout} title="Abmelden">
          <FiPower size={16} />
        </LogoutBtn>
      </NavRight>
    </Nav>

    <ChangePasswordModal isOpen={showPwModal} onClose={() => setShowPwModal(false)} />
    </>
  );
};
