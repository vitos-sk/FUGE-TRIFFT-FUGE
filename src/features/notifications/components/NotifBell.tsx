import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiBell, FiX, FiTrash2, FiCamera, FiMessageSquare } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import { markNotificationRead, markAllRead, deleteNotification, deleteAllNotifications } from '@shared/services/notificationsService';
import { NotifDot } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { useNavigate } from 'react-router-dom';

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
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
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.07);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(340px, calc(100vw - 24px));
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 32px rgba(0,0,0,0.55);
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

const DropHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const DropTitle = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.1);
  }

  &.danger:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
`;

const NotifList = styled.div`
  max-height: 380px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (max-width: 480px) {
    max-height: unset;
    flex: 1;
  }
`;

const NotifItem = styled.div<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $unread }) => ($unread ? 'rgba(204,34,34,0.04)' : 'transparent')};
  border-left: 3px solid ${({ $unread }) => ($unread ? '#cc2222' : 'transparent')};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.bgElevated}; }
`;

const NotifContent = styled.div`
  flex: 1;
  padding: 7px 10px;
  cursor: pointer;
  min-width: 0;
`;

const NotifTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

const NotifTitleText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const TITLE_ICONS: { prefix: string; icon: React.ReactNode }[] = [
  { prefix: 'Neues Foto',  icon: <FiCamera size={11} /> },
  { prefix: 'Neue Notiz',  icon: <FiMessageSquare size={11} /> },
];

function renderTitle(title: string) {
  for (const { prefix, icon } of TITLE_ICONS) {
    if (title.startsWith(prefix)) {
      return <>{icon}<NotifTitleText>{title.slice(prefix.length)}</NotifTitleText></>;
    }
  }
  return <NotifTitleText>{title}</NotifTitleText>;
}

const NotifBody = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotifTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DeleteBtn = styled.button`
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

const Empty = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

interface Props {
  uid: string;
}

export const NotifBell: React.FC<Props> = ({ uid }) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications(uid);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleClick = async (n: { id: string; objectId?: string; photoId?: string }) => {
    await markNotificationRead(uid, n.id);
    setOpen(false);
    if (n.objectId) {
      const url = n.photoId ? `/objects/${n.objectId}?photo=${n.photoId}` : `/objects/${n.objectId}`;
      navigate(url);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(uid, id);
  };

  const notifItems = notifications.length === 0 ? (
    <Empty>Keine Benachrichtigungen</Empty>
  ) : (
    notifications.map((n) => (
      <NotifItem key={n.id} $unread={!n.read}>
        <NotifContent onClick={() => handleClick(n)}>
          <NotifTitle>{renderTitle(n.title)}</NotifTitle>
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

      {open && (
        <Dropdown>
          <DropHeader>
            <DropTitle><FiBell size={16} /></DropTitle>
            <HeaderActions>
              {unreadCount > 0 && (
                <Button $size="sm" $variant="ghost" onClick={() => markAllRead(uid)}>
                  Alle gelesen
                </Button>
              )}
              {notifications.length > 0 && (
                <IconBtn className="danger" onClick={() => deleteAllNotifications(uid)} title="Alle löschen">
                  <FiTrash2 size={13} />
                </IconBtn>
              )}
              <IconBtn onClick={() => setOpen(false)} aria-label="Schließen" style={{ marginLeft: 2 }}>
                <FiX size={14} />
              </IconBtn>
            </HeaderActions>
          </DropHeader>
          <NotifList>{notifItems}</NotifList>
        </Dropdown>
      )}
    </Wrapper>
  );
};
