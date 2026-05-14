import React from 'react';
import styled from 'styled-components';
import { Link, useMatch } from 'react-router-dom';
import { FiGrid, FiClock, FiSettings, FiBarChart2, FiInbox } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useArchivedCount } from '../../hooks/useObjects';

const Bar = styled.nav`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 200;
  padding-bottom: env(safe-area-inset-bottom);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const TabItem = styled(Link)<{ $active: boolean }>`
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

const ActiveBar = styled.span<{ $visible: boolean }>`
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

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const TabIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabBadge = styled.span`
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

interface TabProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
}

const Tab: React.FC<TabProps> = ({ to, icon, label, active, badge }) => (
  <TabItem to={to} $active={active}>
    <ActiveBar $visible={active} />
    <TabIconWrapper>
      <TabIcon>{icon}</TabIcon>
      {badge != null && badge > 0 && <TabBadge>{badge > 99 ? '99+' : badge}</TabBadge>}
    </TabIconWrapper>
    <TabLabel>{label}</TabLabel>
  </TabItem>
);

export const MobileTabBar: React.FC = () => {
  const { isAdmin } = useAuth();
  const archivedCount = useArchivedCount();

  const onRoot      = !!useMatch({ path: '/', end: true });
  const onObjects   = !!useMatch('/objects/*');
  const onHours     = !!useMatch('/hours');
  const onArchiv    = !!useMatch('/archiv');
  const onDashboard = !!useMatch('/dashboard');
  const onAdmin     = !!useMatch('/admin/*');

  return (
    <Bar>
      {isAdmin && (
        <>
          <Tab to="/admin/users" icon={<FiSettings size={20} />}  label="Benutzer"  active={onAdmin} />
          <Tab to="/archiv"      icon={<FiInbox size={20} />}     label="Archiv"    active={onArchiv} badge={archivedCount} />
          <Tab to="/dashboard"   icon={<FiBarChart2 size={20} />} label="Dashboard" active={onDashboard} />
        </>
      )}
      <Tab to="/hours" icon={<FiClock size={20} />} label="Stunden" active={onHours} />
      <Tab to="/"      icon={<FiGrid size={20} />}  label="Objekte" active={onRoot || onObjects} />
    </Bar>
  );
};
