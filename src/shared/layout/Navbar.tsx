import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPower, FiLock, FiInbox, FiSliders } from 'react-icons/fi';
import { logoutUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useArchivedCount } from '@features/objects/hooks/useObjects';
import { NotifBell } from '@features/notifications/components/NotifBell';
import { ChangePasswordModal } from '../ui/ChangePasswordModal';
import {
  Nav,
  Logo,
  NavLinks,
  NavItem,
  Divider,
  NavRight,
  UserChip,
  MobileAvatar,
  Avatar,
  UserName,
  LogoutBtn,
  MenuAnchor,
  SettingsBtn,
  DropMenu,
  MenuItem,
  MenuItemLink,
  MenuBadge,
} from './Navbar.styles';

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
