import styled from 'styled-components';

export const SkeletonWrap = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
`;

export const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  &:last-child { border-bottom: none; }
`;

export const SkeletonCell = styled.div<{ $w?: string; $h?: string; $flex?: boolean; $autoLeft?: boolean }>`
  height: ${({ $h }) => $h ?? '11px'};
  width: ${({ $w }) => $w ?? '80px'};
  border-radius: 5px;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%
  );
  background-size: 200% 100%;
  animation: skshimmer 1.6s ease-in-out infinite;
  flex-shrink: 0;
  ${({ $flex }) => $flex && 'flex: 1; max-width: 160px;'}
  ${({ $autoLeft }) => $autoLeft && 'margin-left: auto;'}

  @keyframes skshimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
