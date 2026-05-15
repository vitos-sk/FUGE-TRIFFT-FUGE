import { useEffect, useState } from 'react';
import { subscribeToNotifications } from '@shared/services/notificationsService';
import type { Notification } from '@shared/types';

export const useNotifications = (uid: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeToNotifications(uid, setNotifications);
    return unsub;
  }, [uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount };
};
