import styled from 'styled-components';
import { Button } from '@shared/ui/Button';
import { Card, DESKTOP, controlHeight } from '@features/hours/components/hoursUi.styles';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textPrimary};

  ${DESKTOP} {
    font-size: 24px;
  }
`;

/** The one filled button on the screen. */
export const AddBtn = styled(Button)`
  ${controlHeight}
  padding-left: 14px;
  padding-right: 16px;
`;

// ── Boss row: filters, export ─────────────────────────────────────

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${DESKTOP} {
    flex-direction: row;
    align-items: center;
  }
`;

export const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${DESKTOP} {
    flex: 1 1 auto;
    max-width: 460px;
  }
`;

export const ExportWrap = styled.div`
  button {
    width: 100%;
  }

  ${DESKTOP} {
    margin-left: auto;

    button {
      width: auto;
    }
  }
`;

// ── List + side panel ─────────────────────────────────────────────────────────

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'side'
    'list';
  gap: 12px;

  ${DESKTOP} {
    grid-template-columns: minmax(0, 1fr) 320px;
    grid-template-areas: 'list side';
    align-items: start;
    gap: 16px;
  }
`;

export const Side = styled.aside`
  grid-area: side;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${DESKTOP} {
    position: sticky;
    top: 74px;
  }
`;

export const ListArea = styled.div`
  grid-area: list;
  min-width: 0;
`;

export const SideButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${DESKTOP} {
    grid-template-columns: 1fr;
  }
`;

export const TotalCard = styled(Card)`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TotalLabel = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
`;

export const TotalValue = styled.span`
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.accent};
  font-variant-numeric: tabular-nums;
`;
