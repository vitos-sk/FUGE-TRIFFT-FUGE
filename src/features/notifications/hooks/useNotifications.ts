import { useEffect, useState, useRef } from 'react';
import { subscribeToNotifications } from '@shared/services/notificationsService';
import type { Notification } from '@shared/types';

export const useNotifications = (uid: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const shownIds  = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!uid) return;

    const unsub = subscribeToNotifications(uid, (incoming) => {
      setNotifications(incoming);

      if (!initialized.current) {
        // First load — mark all existing as seen so we don't flood old notifications
        incoming.forEach((n) => shownIds.current.add(n.id));
        initialized.current = true;
        return;
      }

      // Show OS notification for genuinely new unread items
      if (Notification.permission === 'granted') {
        incoming.forEach((n) => {
          if (n.read || shownIds.current.has(n.id)) return;
          shownIds.current.add(n.id);
          const age = Date.now() - (n.createdAt?.toDate?.()?.getTime() ?? 0);
          if (age < 30_000) {
            new Notification(n.title, {
              body: n.body,
              icon: '/favicon.svg',
              tag: n.id,
              silent: false,
            });
          }
        });
      }
    });

    return () => {
      unsub();
      initialized.current = false;
    };
  }, [uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  return { notifications, unreadCount };
};
