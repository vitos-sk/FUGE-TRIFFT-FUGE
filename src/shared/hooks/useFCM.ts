import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getMessagingInstance } from '../services/firebase';
import { updateFCMToken } from '../services/authService';

export const useFCM = (uid: string | null) => {
  useEffect(() => {
    if (!uid) return;

    const init = async () => {
      // Request permission explicitly if not yet decided
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission !== 'granted') return;

      const messaging = await getMessagingInstance();
      if (!messaging) return;

      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        if (token) await updateFCMToken(uid, token);
      } catch {
        // Permission denied or messaging not supported in this browser
      }

      // Show notification when app is in foreground
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        if (title && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
          });
        }
      });
    };

    init();
  }, [uid]);
};
