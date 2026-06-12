import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
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

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0;
`;
