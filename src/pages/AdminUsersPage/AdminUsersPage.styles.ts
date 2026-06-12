import styled from 'styled-components';

export const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const UserCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;
