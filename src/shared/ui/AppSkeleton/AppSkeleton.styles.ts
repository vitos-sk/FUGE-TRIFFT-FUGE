import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

export const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgPrimary};
  display: flex;
  flex-direction: column;
`;

export const SkNav = styled.div`
  display: none;
  height: 58px;
  background: rgba(10, 10, 10, 0.88);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
  padding: 0 24px;
  gap: 16px;

  @media (min-width: 769px) { display: flex; }
`;

export const SkContent = styled.div`
  flex: 1;
  padding: 20px 16px calc(62px + env(safe-area-inset-bottom) + 16px);

  @media (min-width: 769px) {
    padding: 28px 32px 28px;
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const SkTabBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  background: rgba(10, 10, 10, 0.92);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 200;
  align-items: center;

  @media (max-width: 768px) { display: flex; }
`;

export const Bone = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgCard} 25%,
    ${({ theme }) => theme.colors.bgElevated} 50%,
    ${({ theme }) => theme.colors.bgCard} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 6px;
`;

export const SkCard = styled.div`
  background: #141414;
  border: 1px solid #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

export const SkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

export const SkCircle = styled(Bone)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkLines = styled.div`
  flex: 1;
`;

export const SkTab = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;
