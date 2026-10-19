import styled, { keyframes } from 'styled-components';

export const Head = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 2px 12px;
  padding: 12px 12px 10px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.14);
`;

export const HeadTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.9);
`;

export const HeadTotal = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
  text-align: right;

  strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.8; }
`;

export const RefreshDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const SkeletonRow = styled.li`
  height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);

  &:first-child {
    border-top: 0;
  }
`;

export const SkeletonBar = styled.span<{ $w: string }>`
  display: block;
  height: 11px;
  width: ${({ $w }) => $w};
  max-width: 100%;
  border-radius: 5px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.09) 50%,
    rgba(255, 255, 255, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;

  &:last-child {
    margin-left: auto;
  }
`;

export const Note = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 16px;
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.5);
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.14);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  font-variant-numeric: tabular-nums;
`;
