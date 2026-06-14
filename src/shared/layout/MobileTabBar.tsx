import React from 'react';
import { useMatch } from 'react-router-dom';
import { FiGrid, FiClock, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { Bar, TabItem, ActiveBar, TabIcon, TabLabel, TabIconWrapper, TabBadge } from './MobileTabBar.styles';

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
  const onObjects   = !!useMatch('/objects/*');
  const onHours     = !!useMatch('/hours');
  const onDashboard = !!useMatch('/dashboard');

  return (
    <Bar>
      {isAdmin && (
        <Tab to="/dashboard" icon={<FiBarChart2 size={20} />} label="Dashboard" active={onDashboard} />
      )}
      <Tab to="/objects" icon={<FiGrid size={20} />} label="Objekte" active={onObjects} />
      <Tab to="/hours" icon={<FiClock size={20} />} label="Stunden" active={onHours} />
    </Bar>
  );
};
