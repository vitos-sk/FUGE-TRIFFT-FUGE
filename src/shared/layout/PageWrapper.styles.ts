import styled from 'styled-components';

export const PageWrapper = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 24px;

  @media (max-width: 768px) {
    padding: 18px 16px;
    padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px) + 16px);
  }
`;
