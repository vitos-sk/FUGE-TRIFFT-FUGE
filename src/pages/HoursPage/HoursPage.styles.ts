import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

export const TabBarWrapper = styled.div`
  margin-bottom: 20px;
`;

// Controls panel — narrow card on desktop (like Eintragen), transparent on mobile
export const ViewPanel = styled.div`
  @media (min-width: 769px) {
    background: rgba(255, 255, 255, 0.025);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.07);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 4px 24px rgba(0, 0, 0, 0.5);
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 20px;
    max-width: 580px;
    margin-bottom: 20px;
  }
`;

export const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

export const StatsPeriod = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.01em;
`;

export const StatsValue = styled.div`
  font-size: clamp(30px, 9vw, 40px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
`;

export const StatsLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
`;

export const StatsDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 14px 0;
`;

export const StatsActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(136px, 1fr));
  gap: 8px;
`;

export const StatsBtn = styled.button<{ $done?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 44px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  border: 1px solid
    ${({ $done }) => ($done ? "rgba(34,163,90,0.45)" : "rgba(255,255,255,0.12)")};
  background: ${({ $done }) =>
    $done ? "rgba(34,163,90,0.1)" : "rgba(255,255,255,0.05)"};
  color: ${({ $done }) => ($done ? "#22a35a" : "rgba(255,255,255,0.78)")};

  &:hover:not(:disabled) {
    background: ${({ $done }) =>
      $done ? "rgba(34,163,90,0.15)" : "rgba(255,255,255,0.09)"};
  }

  svg {
    flex-shrink: 0;
    opacity: ${({ $done }) => ($done ? 1 : 0.6)};
  }
`;

export const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const RefreshIndicator = styled.div`
  text-align: center;
  padding: 10px 0 2px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
`;

export const RefreshDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  animation: pulse 1.2s ease-in-out infinite;
  margin-left: 6px;
  vertical-align: middle;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.7;
    }
  }
`;
