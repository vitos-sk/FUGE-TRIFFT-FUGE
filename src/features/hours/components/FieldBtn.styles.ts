import styled from 'styled-components';

export const Btn = styled.button<{ $prominent?: boolean }>`
  width: 100%;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ $prominent }) => $prominent ? '10px 13px' : '8px 11px'};
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 12px;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.4;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }
  &:active {
    background: rgba(255, 255, 255, 0.04);
  }
  &:focus-visible {
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.06);
  }
`;

export const BtnText = styled.span<{ $prominent?: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ $prominent }) => $prominent && `
    font-size: 19px;
    font-weight: 700;
    letter-spacing: 0.02em;
    font-variant-numeric: tabular-nums;
  `}
`;

export const BtnIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
`;
