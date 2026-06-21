import styled, { css } from 'styled-components';

export const SegGroup = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: ${({ $cols }) =>
    $cols !== undefined ? `repeat(${$cols}, 1fr)` : 'repeat(auto-fit, minmax(3rem, 1fr))'};
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 4px;
`;

export const SegBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  font-family: inherit;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;
  min-width: 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.9);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        `
      : css`
          background: transparent;
          color: rgba(255, 255, 255, 0.35);
        `}

  &:hover:not(:disabled) {
    color: rgba(255, 255, 255, 0.65);
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 5px 4px;
    letter-spacing: 0;
  }
`;
