import styled from 'styled-components';

export const Wrap = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button<{ $open: boolean }>`
  width: 100%;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ $open }) => $open ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.3);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 12px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
  }

  ${({ $open }) => $open && `
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.06);
  `}

  @media (max-width: 560px) {
    padding: 7px 10px;
    font-size: 11px;
    gap: 6px;
  }
`;

export const TriggerText = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Arrow = styled.span<{ $open: boolean; $dropUp?: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.2s ease, color 0.15s;
  transform: ${({ $open, $dropUp }) =>
    $dropUp
      ? $open ? 'rotate(180deg)' : 'rotate(0deg)'
      : $open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const Dropdown = styled.div<{ $dropUp?: boolean }>`
  position: absolute;
  ${({ $dropUp }) => $dropUp
    ? 'bottom: calc(100% + 4px); top: auto;'
    : 'top: calc(100% + 4px);'}
  right: 0;
  left: auto;
  min-width: 200px;
  max-width: 320px;
  z-index: 9999;
  background: rgba(10, 6, 6, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 4px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  max-height: 280px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }

  @media (max-width: 560px) {
    left: 0;
    right: auto;
    min-width: max(200px, 100%);
    max-width: min(320px, calc(100vw - 32px));
  }
`;

export const OptionBtn = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(204, 34, 34, 0.14)' : 'transparent'};
  color: ${({ $active }) => $active ? '#ff6060' : 'rgba(255, 255, 255, 0.72)'};
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.95);
  }
`;

export const Check = styled.span`
  flex-shrink: 0;
  width: 14px;
  display: flex;
  align-items: center;
  color: #ff6060;
`;
