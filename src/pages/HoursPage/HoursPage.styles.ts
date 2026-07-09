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
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 560px) {
    padding: 12px 14px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const StatsLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatsLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 6px;
`;

export const StatsValue = styled.div`
  font-size: clamp(22px, 6vw, 28px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;
  line-height: 1;
`;

export const StatsActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
  min-width: 148px;

  @media (max-width: 560px) {
    min-width: 130px;
    gap: 4px;
  }

  @media (max-width: 480px) {
    flex-direction: row;
    min-width: 0;
    gap: 8px;
  }
`;

export const StatsBtn = styled.button<{ $done?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 11px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  border: 1px solid
    ${({ $done }) => ($done ? "rgba(34,163,90,0.45)" : "rgba(255,255,255,0.12)")};
  background: ${({ $done }) =>
    $done ? "rgba(34,163,90,0.1)" : "rgba(255,255,255,0.06)"};
  color: ${({ $done }) => ($done ? "#22a35a" : "rgba(255,255,255,0.72)")};

  &:hover:not(:disabled) {
    background: ${({ $done }) =>
      $done ? "rgba(34,163,90,0.15)" : "rgba(255,255,255,0.1)"};
  }

  @media (max-width: 560px) {
    gap: 4px;
    padding: 3px 7px;
    font-size: 11px;
    border-radius: 6px;

    svg {
      width: 11px;
      height: 11px;
    }
  }

  @media (max-width: 480px) {
    flex: 1;
    min-height: 28px;
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
