import styled from 'styled-components';
import { Button } from '@shared/ui/Button';

export const ArchivedCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  opacity: 0.7;
  overflow: hidden;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.92;
    border-color: rgba(255, 255, 255, 0.13);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 8px 28px rgba(0, 0, 0, 0.35);
  }
`;

export const CardHeader = styled.div`
  padding: 14px 16px 0;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

export const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.3;
  flex: 1;
`;

export const Location = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  svg { flex-shrink: 0; }
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
`;

export const CardFooter = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ArchivedDate = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const DangerBtn = styled(Button)`
  color: ${({ theme }) => theme.colors.accent};
  padding: 5px 8px;

  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
