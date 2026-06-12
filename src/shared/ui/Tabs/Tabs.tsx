import React, { useEffect, useRef, useState } from 'react';
import { Sentinel, StickyShell, Rail, TabBtn } from './Tabs.styles';

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
