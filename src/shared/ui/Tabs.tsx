import React from 'react';
import styled from 'styled-components';

const StickyShell = styled.div`
  position: sticky;
  top: 58px;
  z-index: 100;
  margin: 0 -24px 20px;
  padding: 5px 24px 6px;
  background: rgba(10, 10, 10, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  @media (max-width: 768px) {
    margin: 0 -16px 16px;
    padding: 5px 16px 6px;
  }
`;

const Rail = styled.div`
  display: flex;
  gap: 3px;
  padding: 4px;
  background: transparent;
  border-radius: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const TabBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textMuted)};
  background: ${({ $active, theme }) =>
    $active
      ? `linear-gradient(135deg, ${theme.colors.accent}e0 0%, ${theme.colors.accent}a0 100%)`
      : 'transparent'};
  border-radius: 7px;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: ${({ $active }) =>
    $active
      ? '0 2px 12px rgba(204,34,34,0.4), inset 0 1px 0 rgba(255,255,255,0.14)'
      : 'none'};

  &:hover {
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textSecondary)};
    background: ${({ $active, theme }) =>
      !$active ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${theme.colors.accent}e0 0%, ${theme.colors.accent}a0 100%)`};
  }

  svg {
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    transition: opacity 0.15s ease;
  }

  @media (max-width: 480px) {
    padding: 8px 11px;
    font-size: 11px;
    gap: 5px;
  }
`;

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <StickyShell>
    <Rail>
      {tabs.map((tab) => (
        <TabBtn key={tab.id} $active={activeTab === tab.id} onClick={() => onChange(tab.id)}>
          {tab.icon}
          {tab.label}
        </TabBtn>
      ))}
    </Rail>
  </StickyShell>
);
