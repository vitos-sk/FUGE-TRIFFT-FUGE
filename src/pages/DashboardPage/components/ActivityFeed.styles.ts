import styled from 'styled-components';

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

export const Item = styled.li<{ $clickable: boolean }>`
  display: grid;
  grid-template-columns: 26px 1fr auto;
  align-items: start;
  gap: 10px;
  padding: 9px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background ${({ theme }) => theme.transitions.fast};

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  &:hover {
    background: ${({ $clickable }) => ($clickable ? 'rgba(255,255,255,0.04)' : 'transparent')};
  }
`;

export const IconBubble = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ $color }) => $color}1a;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const Body = styled.div`
  min-width: 0;
`;

export const Title = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Detail = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const Time = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  padding-top: 2px;
`;
