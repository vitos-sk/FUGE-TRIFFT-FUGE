import styled, { css } from 'styled-components';
import type { NoteTag, PhotoType } from '../../types';

interface BadgeProps {
  $tag?: NoteTag;
  $photoType?: PhotoType;
}

const tagColors: Record<NoteTag, string> = {
  material: '#9b59b6',
  garbage: '#7f8c8d',
  problem: '#c0392b',
  delivery: '#2980b9',
  general: '#666',
};

const photoTypeColors: Record<PhotoType, string> = {
  before: '#3498db',
  after: '#27ae60',
  daily: '#c9a84c',
  problem: '#c0392b',
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;

  ${({ $tag }) =>
    $tag &&
    css`
      background: ${tagColors[$tag]}20;
      color: ${tagColors[$tag]};
      border: 1px solid ${tagColors[$tag]}40;
    `}

  ${({ $photoType }) =>
    $photoType &&
    css`
      background: ${photoTypeColors[$photoType]}20;
      color: ${photoTypeColors[$photoType]};
      border: 1px solid ${photoTypeColors[$photoType]}40;
    `}
`;

export const NotifDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(4px, -4px);
  border: 2px solid ${({ theme }) => theme.colors.bgPrimary};
`;
