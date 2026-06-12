import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiBell, FiX, FiTrash2, FiCamera, FiMessageSquare } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import { markNotificationRead, markAllRead, deleteNotification, deleteAllNotifications } from '@shared/services/notificationsService';
import { NotifDot } from '@shared/ui/Badge';
import { Button } from '@shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  Wrapper,
  BellBtn,
  Dropdown,
  DropHeader,
  DropTitle,
  HeaderActions,
  IconBtn,
  NotifList,
  NotifItem,
  NotifContent,
  NotifTitle,
  NotifTitleText,
  NotifBody,
  NotifTime,
  DeleteBtn,
  Empty,
} from './NotifBell.styles';

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

  const handleClick = async (n: { id: string; objectId?: string; photoId?: string; noteId?: string }) => {
    await markNotificationRead(uid, n.id);
    setOpen(false);
    if (n.objectId) {
      let url = `/objects/${n.objectId}`;
      if (n.photoId) {
        url += `?photo=${n.photoId}`;
      } else if (n.noteId) {
        url += `?note=${n.noteId}`;
      } else {
        url += `?tab=notes`;
      }
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
              <IconBtn onClick={() => setOpen(false)} aria-label="Schließen" $ml>
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
