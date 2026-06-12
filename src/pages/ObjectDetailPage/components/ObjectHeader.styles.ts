import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 22px;
  transition: color ${({ theme }) => theme.transitions.fast};
  font-weight: 500;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
  line-height: 1.25;
`;

export const Meta = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 5px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 5px;
  svg { flex-shrink: 0; }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const MapsBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  color: #e8e8e8;
  border: 1px solid rgba(234,67,53,0.35);
  background: rgba(234,67,53,0.08);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 7px 13px;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #fff;
    border-color: rgba(234,67,53,0.7);
    background: rgba(234,67,53,0.16);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(234,67,53,0.2);
  }
  &:active { transform: none; }
`;
