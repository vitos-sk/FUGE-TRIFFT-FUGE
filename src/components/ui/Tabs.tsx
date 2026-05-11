import React from 'react';
import styled from 'styled-components';

const TabsWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 11px 20px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  margin-bottom: -1px;
  letter-spacing: 0.01em;
  cursor: pointer;
  outline: none;

  &:hover {
    color: ${({ $active, theme }) => $active ? theme.colors.textPrimary : '#c0c0c0'};
    background: rgba(255,255,255,0.03);
  }

  &:focus-visible {
    background: rgba(255,255,255,0.04);
  }
`;

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <TabsWrapper>
    {tabs.map((tab) => (
      <TabButton key={tab.id} $active={activeTab === tab.id} onClick={() => onChange(tab.id)}>
        {tab.label}
      </TabButton>
    ))}
  </TabsWrapper>
);
