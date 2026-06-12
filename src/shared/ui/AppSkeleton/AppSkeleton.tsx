import React from 'react';
import { Shell, SkNav, SkContent, SkTabBar, Bone, SkCard, SkRow, SkCircle, SkLines, SkTab } from './AppSkeleton.styles';

const Card: React.FC<{ noLine?: boolean }> = ({ noLine }) => (
  <SkCard>
    <SkRow>
      <SkCircle />
      <SkLines>
        <Bone style={{ height: 13, marginBottom: 7, width: '55%' }} />
        <Bone style={{ height: 10, width: '38%' }} />
      </SkLines>
    </SkRow>
    {!noLine && <Bone style={{ height: 10, width: '75%' }} />}
  </SkCard>
);

export const AppSkeleton: React.FC = () => (
  <Shell>
    <SkNav>
      <Bone style={{ width: 80, height: 16 }} />
      <div style={{ flex: 1 }} />
      <Bone style={{ width: 32, height: 32, borderRadius: '50%' }} />
    </SkNav>
    <SkContent>
      <Bone style={{ height: 26, width: 140, marginBottom: 20 }} />
      <Card />
      <Card />
      <Card noLine />
    </SkContent>
    <SkTabBar>
      {[0, 1, 2, 3].map((i) => (
        <SkTab key={i}>
          <Bone style={{ width: 22, height: 22, borderRadius: 4 }} />
          <Bone style={{ width: 28, height: 6 }} />
        </SkTab>
      ))}
    </SkTabBar>
  </Shell>
);
