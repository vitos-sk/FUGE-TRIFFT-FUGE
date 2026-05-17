import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiBell, FiX } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import { markNotificationRead, markAllRead, deleteNotification, deleteAllNotifications } from '@shared/services/notificationsService';
import { NotifDot } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { useNavigate } from 'react-router-dom';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Wrapper = styled.div`
  position: relative;
`;

const BellBtn = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 17px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.07);
  }
`;

/* Desktop dropdown */
const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(340px, calc(100vw - 16px));
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  z-index: 500;
  overflow: hidden;
  animation: ${fadeDown} 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 480px) {
    display: none;
  }
`;

/* Mobile backdrop */
const Backdrop = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 499;
    animation: ${fadeIn} 0.2s ease;
  }
`;

/* Mobile bottom sheet */
const BottomSheet = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 72vh;
    background: ${({ theme }) => theme.colors.bgCard};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px 16px 0 0;
    z-index: 500;
    overflow: hidden;
    animation: ${slideUp} 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const SheetHandle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.border};
  margin: 10px auto 0;
  flex-shrink: 0;
`;

const DropHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 10px 14px;
  }
`;

const DropTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CloseBtn = styled.button`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.bgElevated};
    flex-shrink: 0;
    margin-left: 4px;
  }
`;

const NotifList = styled.div`
  max-height: 380px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 480px) {
    max-height: unset;
    flex: 1;
    overflow-y: auto;
  }
`;

const NotifItem = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $unread }) => ($unread ? 'rgba(204,34,34,0.04)' : 'transparent')};
  border-left: 3px solid ${({ $unread }) => ($unread ? '#cc2222' : 'transparent')};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.bgElevated}; }
`;

const NotifContent = styled.div`
  flex: 1;
  padding: 11px 12px;
  cursor: pointer;
  min-width: 0;
  min-height: 44px;

  @media (max-width: 480px) {
    padding: 13px 12px;
  }
`;

const NotifTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotifBody = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NotifTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DeleteBtn = styled.button`
  flex-shrink: 0;
  width: 44px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  border-left: 1px solid transparent;

  ${NotifItem}:hover & {
    opacity: 1;
  }

  /* Always visible on touch devices */
  @media (max-width: 480px) {
    opacity: 1;
    width: 48px;
    border-left-color: ${({ theme }) => theme.colors.border};
  }

  &:hover, &:active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    border-left-color: ${({ theme }) => theme.colors.border};
  }
`;

const Empty = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;

  @media (max-width: 480px) {
    padding: 40px 16px;
    font-size: 13px;
  }
`;

interface Props {
  uid: string;
}

export const NotifBell: React.FC<Props> = ({ uid }) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications(uid);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click — must also ignore clicks inside the portal (sheetRef)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const inWrapper = wrapperRef.current?.contains(e.target as Node);
      const inSheet = sheetRef.current?.contains(e.target as Node);
      if (!inWrapper && !inSheet) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (id: string, objectId?: string) => {
    await markNotificationRead(uid, id);
    setOpen(false);
    if (objectId) navigate(`/objects/${objectId}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(uid, id);
  };

  const headerActions = (
    <HeaderActions>
      {unreadCount > 0 && (
        <Button $size="sm" $variant="ghost" onClick={() => markAllRead(uid)}>
          Alle gelesen
        </Button>
      )}
      {notifications.length > 0 && (
        <Button $size="sm" $variant="ghost" onClick={() => deleteAllNotifications(uid)}>
          Alle löschen
        </Button>
      )}
      <CloseBtn onClick={() => setOpen(false)} aria-label="Schließen">
        <FiX size={15} />
      </CloseBtn>
    </HeaderActions>
  );

  const notifItems = notifications.length === 0 ? (
    <Empty>Keine Benachrichtigungen</Empty>
  ) : (
    notifications.map((n) => (
      <NotifItem key={n.id} $unread={!n.read}>
        <NotifContent onClick={() => handleClick(n.id, n.objectId)}>
          <NotifTitle>{n.title}</NotifTitle>
          <NotifBody>{n.body}</NotifBody>
          <NotifTime>
            {n.createdAt?.toDate
              ? format(n.createdAt.toDate(), 'dd.MM.yy HH:mm', { locale: de })
              : ''}
          </NotifTime>
        </NotifContent>
        <DeleteBtn onClick={(e) => handleDelete(e, n.id)} title="Löschen">
          <FiX size={13} />
        </DeleteBtn>
      </NotifItem>
    ))
  );

  return (
    <Wrapper ref={wrapperRef}>
      <BellBtn onClick={() => setOpen((v) => !v)}>
        <FiBell size={18} />
        {unreadCount > 0 && <NotifDot>{unreadCount > 9 ? '9+' : unreadCount}</NotifDot>}
      </BellBtn>

      {/* Desktop dropdown */}
      {open && (
        <Dropdown>
          <DropHeader>
            <DropTitle>Benachrichtigungen</DropTitle>
            {headerActions}
          </DropHeader>
          <NotifList>{notifItems}</NotifList>
        </Dropdown>
      )}

      {/* Mobile: backdrop + bottom sheet via portal to escape backdrop-filter stacking context */}
      {open && createPortal(
        <>
          <Backdrop onClick={() => setOpen(false)} />
          <BottomSheet ref={sheetRef}>
            <SheetHandle />
            <DropHeader>
              <DropTitle>Benachrichtigungen</DropTitle>
              {headerActions}
            </DropHeader>
            <NotifList>{notifItems}</NotifList>
          </BottomSheet>
        </>,
        document.body
      )}
    </Wrapper>
  );
};
