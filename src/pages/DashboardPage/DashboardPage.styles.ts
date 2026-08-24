import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
`;

export const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DateTag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.5;
`;

export const RefreshTag = styled.span`
  margin-left: auto;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
  white-space: nowrap;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const EvenGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
