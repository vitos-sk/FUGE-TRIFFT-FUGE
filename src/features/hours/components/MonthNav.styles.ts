import styled, { css } from 'styled-components';
import { controlHeight } from './hoursUi.styles';

export const Wrap = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  gap: 8px;
`;

const baseBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.85);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const Arrow = styled.button`
  ${baseBtn}
  ${controlHeight}
`;

export const Title = styled.button`
  ${baseBtn}
  ${controlHeight}
  gap: 8px;
  font-size: 15px;
  font-weight: 600;

  svg {
    opacity: 0.6;
  }
`;
