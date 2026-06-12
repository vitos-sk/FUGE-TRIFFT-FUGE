import styled from 'styled-components';
import { Input } from '@shared/ui/Input';

export const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

export const SearchInput = styled(Input)`
  padding-left: 36px;
  width: 100%;
`;

export const Count = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
  white-space: nowrap;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

export const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export const EmptyIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.3;
  display: flex;
  justify-content: center;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0;
`;
