import styled from 'styled-components';

export const ListItem = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ $active }) => ($active ? 'rgba(204, 34, 34, 0.14)' : 'transparent')};
  font-family: inherit;
  font-size: 0.9375rem;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(204, 34, 34, 0.2)' : 'rgba(255, 255, 255, 0.07)'};
  }
  &:active { opacity: 0.75; }
`;

export const ItemLabel = styled.span<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? '#ff6060' : 'rgba(255, 255, 255, 0.85)')};
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
`;

export const CheckIcon = styled.span`
  flex-shrink: 0;
  width: 1rem;
  display: flex;
  align-items: center;
  color: #ff6060;
`;
