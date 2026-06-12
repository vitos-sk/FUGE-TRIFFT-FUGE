import styled from 'styled-components';
import { Button } from '@shared/ui/Button';

export const ArchivedCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.4);
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  opacity: 0.65;
  transition: opacity ${({ theme }) => theme.transitions.fast}, border-color ${({ theme }) => theme.transitions.fast};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.textMuted};
    border-radius: ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0 0;
  }

  &:hover {
    opacity: 0.9;
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

export const CardHeader = styled.div`
  padding: 18px 18px 0;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

export const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.3;
  flex: 1;
`;

export const ArchivedBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const Location = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  svg { flex-shrink: 0; }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 18px;
`;

export const CardFooter = styled.div`
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ArchivedDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardActions = styled.div`
  display: flex;
  gap: 6px;
`;

export const DangerBtn = styled(Button)`
  color: ${({ theme }) => theme.colors.accent};
`;
