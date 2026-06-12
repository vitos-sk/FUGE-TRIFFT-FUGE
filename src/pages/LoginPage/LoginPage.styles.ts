import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgPrimary};
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftPanel = styled.div`
  background: #0a0a0a;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(204,34,34,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(204,34,34,0.04) 0%, transparent 65%);
    pointer-events: none;
  }
`;

export const BigLogo = styled.div`
  text-align: center;
  z-index: 1;
`;

export const BigLogoText = styled.div`
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  margin-bottom: 6px;

  span {
    color: ${({ theme }) => theme.colors.accent};
    display: block;
  }
`;

export const Tagline = styled.p`
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 22px;
`;

export const AccentLine = styled.div`
  width: 36px;
  height: 2px;
  background: ${({ theme }) => theme.colors.accent};
  margin: 18px auto;
  border-radius: 9999px;
`;

export const RightPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 360px;
  animation: ${fadeIn} 0.35s ease;
`;

export const MobileLogo = styled.div`
  text-align: center;
  margin-bottom: 40px;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileLogoText = styled.div`
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};

  span { color: ${({ theme }) => theme.colors.accent}; }
`;
