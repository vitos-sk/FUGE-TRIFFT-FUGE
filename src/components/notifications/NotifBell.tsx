import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiBell, FiX } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { markNotificationRead, markAllRead, deleteNotification } from '../../services/notificationsService';
import { NotifDot } from '../ui/Badge';
import { Button } from '../ui/Button';
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
  font-size: 17px;
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
  width: min(340px, calc(100vw - 16px));
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  z-index: 500;
  overflow: hidden;
  animation: ${fadeDown} 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 480px) {
    right: -8px;
    width: min(300px, calc(100vw - 24px));
  }
`;

const DropHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const DropTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const NotifList = styled.div`
  max-height: 380px;
  overflow-y: auto;

  @media (max-width: 480px) {
    max-height: 220px;
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

  @media (max-width: 480px) {
    padding: 8px 10px;
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
  width: 32px;
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

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
    border-left-color: ${({ theme }) => theme.colors.border};
  }
`;

const Empty = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;

  @media (max-width: 480px) {
    padding: 16px;
    font-size: 12px;
  }
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

  return (
    <Wrapper ref={wrapperRef}>
      <BellBtn onClick={() => setOpen((v) => !v)}>
        <FiBell size={18} />
        {unreadCount > 0 && <NotifDot>{unreadCount > 9 ? '9+' : unreadCount}</NotifDot>}
      </BellBtn>
      {open && (
        <Dropdown>
          <DropHeader>
            <DropTitle>Benachrichtigungen</DropTitle>
            {unreadCount > 0 && (
              <Button $size="sm" $variant="ghost" onClick={() => markAllRead(uid)}>
                Alle gelesen
              </Button>
            )}
          </DropHeader>
          <NotifList>
            {notifications.length === 0 ? (
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
            )}
          </NotifList>
        </Dropdown>
      )}
    </Wrapper>
  );
};
