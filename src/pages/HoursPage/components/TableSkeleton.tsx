import React from 'react';
import { SkeletonWrap, SkeletonRow, SkeletonCell } from './TableSkeleton.styles';

const SKELETON_ROWS = 5;

export const TableSkeleton: React.FC = () => (
  <SkeletonWrap>
    {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
      <SkeletonRow key={i}>
        <SkeletonCell $w="60px" />
        <SkeletonCell $w="90px" />
        <SkeletonCell $w="70px" />
        <SkeletonCell $w="110px" $flex />
        <SkeletonCell $w="44px" $autoLeft />
      </SkeletonRow>
    ))}
  </SkeletonWrap>
);
