import styled from 'styled-components';

/* ── Mobile toggle ──────────────────────────────────────────────────── */

export const MobileToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.16);
  }

  &:active {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.35);
  }

  /* Hidden on desktop — InfoTab always expanded in the right sidebar */
  @media (min-width: 1025px) {
    display: none;
  }
`;

export const ToggleChevron = styled.span<{ $open: boolean }>`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: inline-block;
  line-height: 1;
`;

/* On mobile: expand/collapse with max-height transition */
export const CollapsibleContent = styled.div<{ $open: boolean }>`
  @media (max-width: 1024px) {
    overflow: hidden;
    max-height: ${({ $open }) => ($open ? '700px' : '0')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition: max-height 0.3s ease, opacity 0.2s ease,
      padding-top 0.2s ease;
    padding-top: ${({ $open }) => ($open ? '16px' : '0')};
  }
`;

/* ── Info grid ──────────────────────────────────────────────────────── */

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
`;

export const InfoItemWide = styled(InfoItem)`
  grid-column: 1 / -1;
`;

export const InfoLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CopyBtn = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px;
  border-radius: 4px;
  min-height: 28px;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.06);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(204, 34, 34, 0.35);
  }
`;

/* ── Edit button ────────────────────────────────────────────────────── */

export const EditBtnWrap = styled.div`
  > button {
    width: 100%;
    height: 48px;
    border-radius: 10px;
    font-size: 15px;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
  }
`;

/* ── Danger zone ────────────────────────────────────────────────────── */

export const DangerZone = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;

  > button {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    font-size: 14px;
    text-transform: none;
    letter-spacing: 0;
  }
`;

export const DangerTitle = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;
