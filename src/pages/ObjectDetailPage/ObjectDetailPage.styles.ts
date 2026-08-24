import styled from 'styled-components';
import { glassSurface } from '../../styles/glass';

export const PageBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 40px 0;
`;

/* Full-width Fotos/Chat switcher with an accent underline on the active tab */
export const TabsBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 12px;
  ${glassSurface};
  border-radius: 14px;
  overflow: hidden;

  /* Desktop: a compact segmented control, not a full-width banner */
  @media (min-width: 769px) {
    align-self: flex-start;
    grid-template-columns: repeat(2, minmax(0, auto));
    border-radius: 12px;
  }
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 10px;
  font-family: inherit;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  background: ${({ $active, theme }) =>
    $active ? theme.glass.fillActive : 'transparent'};
  border: none;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accentHover : theme.colors.textSecondary};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.accentHover : theme.colors.textPrimary};
    background: ${({ $active, theme }) =>
      $active ? theme.glass.fillActive : theme.glass.fillHover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset ${({ theme }) => theme.shadows.focus};
  }

  @media (min-width: 769px) {
    padding: 11px 26px;
    font-size: 13.5px;
  }
`;

export const TabBadge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const SectionBlock = styled.section`
  padding: 22px 0 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  line-height: 1.4;
`;
