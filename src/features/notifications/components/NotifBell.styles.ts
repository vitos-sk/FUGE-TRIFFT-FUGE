import styled, { keyframes } from 'styled-components';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const BellBtn = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.07);
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(340px, calc(100vw - 24px));
  background: rgba(16, 16, 16, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
  z-index: 500;
  overflow: hidden;
  animation: ${fadeDown} 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 480px) {
    position: fixed;
    top: 66px;
    left: 8px;
    right: 8px;
    width: auto;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
  }
`;

export const DropHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

export const DropTitle = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconBtn = styled.button<{ $ml?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  ${({ $ml }) => $ml && 'margin-left: 2px;'}

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.1);
  }

  &.danger:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

export const NotifList = styled.div`
  max-height: 380px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (max-width: 480px) {
    max-height: unset;
    flex: 1;
  }
`;

export const NotifItem = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $unread }) => ($unread ? 'rgba(204,34,34,0.04)' : 'transparent')};
  border-left: 3px solid ${({ $unread }) => ($unread ? '#cc2222' : 'transparent')};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255, 255, 255, 0.06); }
`;

export const NotifContent = styled.div`
  flex: 1;
  padding: 7px 10px;
  cursor: pointer;
  min-width: 0;
`;

export const NotifTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const NotifTitleText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const NotifBody = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotifTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DeleteBtn = styled.button`
  flex-shrink: 0;
  width: 34px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  border-left: 1px solid transparent;

  ${NotifItem}:hover & { opacity: 1; }

  @media (max-width: 480px) {
    opacity: 1;
    width: 36px;
    border-left-color: ${({ theme }) => theme.colors.border};
  }

  &:hover, &:active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    border-left-color: ${({ theme }) => theme.colors.border};
  }
`;

export const Empty = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;
