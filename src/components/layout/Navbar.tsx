import React from 'react';
import styled from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';
import { logoutUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { NotifBell } from '../notifications/NotifBell';

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

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: 36px;
  gap: 2px;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
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
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  @media (max-width: 480px) {
    display: none;
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

export const Navbar: React.FC = () => {
  const { user, uid, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <Nav>
      <Logo to="/">
        FUGE <span>TRIFFT</span> FUGE
      </Logo>

      <NavLinks>
        <NavItem to="/" end>Objekte</NavItem>
        <NavItem to="/hours">Stunden</NavItem>
        {isAdmin && (
          <>
            <Divider />
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
        <LogoutBtn onClick={handleLogout} title="Abmelden">
          <FiPower size={16} />
        </LogoutBtn>
      </NavRight>
    </Nav>
  );
};
