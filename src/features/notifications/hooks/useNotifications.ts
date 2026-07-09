import { useEffect, useState } from 'react';
import { subscribeToNotifications } from '@features/notifications/services';
import type { Notification } from '@shared/types';

// Firestore-backed data for the in-app NotifBell dropdown only.
// System push notifications are handled exclusively via FCM (useFCM.ts +
// firebase-messaging-sw.js) — do not spawn `new Notification(...)` here,
// it would duplicate the FCM push for the same event.
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
