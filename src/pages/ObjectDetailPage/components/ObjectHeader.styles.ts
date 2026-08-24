import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glassSurface } from '../../../styles/glass';

/* Compact header card: thumbnail + title/address, meta strip below */
export const HeaderCard = styled.header`
  ${glassSurface};
  border-radius: 14px;
  overflow: hidden;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;

  @media (max-width: 640px) {
    gap: 10px;
    padding: 10px;
  }
`;

export const BackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: 1px solid transparent;
  transition: color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/* Square map thumbnail standing in for the object photo */
export const Thumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 62px;
  height: 62px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.glass.border};

  @media (max-width: 640px) {
    width: 54px;
    height: 54px;
  }
`;

/* Sits behind the map image and shows through when it fails to load */
export const ThumbFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};

  + img {
    position: relative;
    z-index: 1;
  }
`;

export const TitleBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Title = styled.h1`
  font-size: 21px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    font-size: 19px;
  }
`;

export const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
`;

export const Address = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    flex-shrink: 0;
  }
`;

export const MapsBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  transition: background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/* Deadline pill — stands where the mockup shows the status chip */
export const DeadlineChip = styled.span<{ $urgent: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  background: ${({ $urgent }) =>
    $urgent ? 'rgba(204,34,34,0.16)' : 'rgba(255,255,255,0.06)'};
  border: 1px solid
    ${({ $urgent }) => ($urgent ? 'rgba(204,34,34,0.4)' : 'rgba(255,255,255,0.1)')};
  color: ${({ $urgent, theme }) =>
    $urgent ? theme.colors.accentHover : theme.colors.textSecondary};
`;

export const MenuBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: flex-start;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: 1px solid transparent;
  transition: color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

/* Two-cell strip with a divider, as in the mockup */
export const MetaStrip = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid ${({ theme }) => theme.glass.border};

  > * + * {
    border-left: 1px solid ${({ theme }) => theme.glass.border};
  }

  /* Desktop: cells hug their text instead of splitting the whole card */
  @media (min-width: 769px) {
    grid-template-columns: repeat(2, minmax(0, max-content));
    justify-content: start;
  }
`;

export const MetaCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 12px;
    gap: 7px;
  }
`;

/* Text needs its own box — a bare text node in a flex row won't ellipsize */
export const MetaText = styled.span`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WhatsAppRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

export const WhatsAppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  min-height: 44px;
  padding: 0 20px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  ${glassSurface};
  border-radius: 12px;
  transition: border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.glass.borderHover};
    background: ${({ theme }) => theme.glass.fillHover};
  }

  &:active {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (min-width: 641px) {
    flex: 0 0 auto;
    min-width: 160px;
  }
`;
