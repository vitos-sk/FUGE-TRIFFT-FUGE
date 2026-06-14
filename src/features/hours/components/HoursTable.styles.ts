import styled from 'styled-components';

export const Outer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
`;

export const TableWrapper = styled.div`
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  background: rgba(18,18,18,0.85);
  /* Скрываем нативный — заменяем кастомным */
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const ScrollTrack = styled.div`
  height: 6px;
  background: rgba(255,255,255,0.05);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
`;

export const ScrollThumb = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(255,255,255,0.22);
  border-radius: 3px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.38); }
  &:active { cursor: grabbing; background: rgba(255,255,255,0.5); }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 560px;
`;

export const Th = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(255,255,255,0.025);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;

  @media (max-width: 639px) {
    padding: 8px 10px;
    font-size: 9px;
  }
`;

export const Td = styled.td`
  padding: 9px 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid rgba(255,255,255,0.04);
  white-space: nowrap;
  line-height: 1.4;
  &:last-child { text-align: right; }

  @media (max-width: 639px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

export const Tr = styled.tr`
  transition: background ${({ theme }) => theme.transitions.fast};
  &:last-child td { border-bottom: none; }
  &:hover td { background: rgba(255,255,255,0.025); }
`;

export const ActionCell = styled.td`
  padding: 5px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  text-align: right;
  white-space: nowrap;

  @media (max-width: 639px) { padding: 5px 8px; }
`;

export const Empty = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  background: rgba(18,18,18,0.85);
`;

export const HideMobile = styled(Th)`
  @media (max-width: 639px) { display: none; }
`;
export const HideMobileTd = styled(Td)`
  @media (max-width: 639px) { display: none; }
`;

// Table hidden on very narrow screens (cards take over)
export const DesktopTable = styled.div`
  @media (max-width: 479px) { display: none; }
`;

// Mobile card list — shows only below 480px
export const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 479px) { display: flex; }
`;

export const EntryCard = styled.div`
  background: rgba(18, 18, 18, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px 14px;
`;

export const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const CardDate = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CardTotal = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardSubMeta = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.28);
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const EditStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FooterTotal = styled.div`
  padding: 9px 16px;
  background: rgba(204,34,34,0.08);
  border: 1px solid rgba(204,34,34,0.2);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

export const FooterBtns = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 480px) { button { flex: 1; } }
`;
