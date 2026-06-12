import styled from 'styled-components';

export const TabContent = styled.div`
  padding: 22px 0;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0;
`;

export const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 40px 0;
`;
