import React from 'react';
import { Block, Row } from './DashboardSkeleton.styles';

export const DashboardSkeleton: React.FC = () => (
  <>
    <Row $cols={4}>
      {[0, 1, 2, 3].map((i) => (
        <Block key={i} $height={108} />
      ))}
    </Row>
    <Row $cols={1}>
      <Block $height={124} />
    </Row>
    <Row $cols={2}>
      <Block $height={330} />
      <Block $height={330} />
    </Row>
    <Row $cols={1}>
      <Block $height={220} />
    </Row>
  </>
);
