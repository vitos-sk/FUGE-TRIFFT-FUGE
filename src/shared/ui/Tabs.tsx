import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const Sentinel = styled.div`
  height: 1px;
  margin-bottom: -1px;
  pointer-events: none;
`;

const StickyShell = styled.div<{ $stuck: boolean }>`
  position: sticky;
  top: 58px;
  z-index: 100;
  margin: 0 -24px 20px;
  padding: 5px 24px 6px;
  transition: background 0.2s ease, backdrop-filter 0.2s ease, border-color 0.2s ease;

  ${({ $stuck }) => $stuck ? css`
    background: rgba(8, 8, 8, 0.78);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  ` : css`
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: 1px solid transparent;
  `}

  @media (max-width: 768px) {
    top: 0;
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
  border-radius: 7px;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  border: 1px solid transparent;

  color: ${({ $active }) => $active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)'};
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.11)' : 'transparent'};
  border-color: ${({ $active }) => $active ? 'rgba(255,255,255,0.15)' : 'transparent'};
  box-shadow: ${({ $active }) => $active ? 'inset 0 1px 0 rgba(255,255,255,0.09)' : 'none'};

  &:hover {
    ${({ $active }) => !$active && `
      color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.05);
    `}
  }

  svg {
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
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

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: [1] }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Sentinel ref={sentinelRef} />
      <StickyShell $stuck={isStuck}>
        <Rail>
          {tabs.map((tab) => (
            <TabBtn key={tab.id} $active={activeTab === tab.id} onClick={() => onChange(tab.id)}>
              {tab.icon}
              {tab.label}
            </TabBtn>
          ))}
        </Rail>
      </StickyShell>
    </>
  );
};
