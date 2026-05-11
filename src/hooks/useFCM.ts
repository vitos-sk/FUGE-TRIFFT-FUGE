import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getMessagingInstance } from '../services/firebase';
import { updateFCMToken } from '../services/authService';

export const useFCM = (uid: string | null) => {
  useEffect(() => {
    if (!uid) return;

    const init = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        if (token) await updateFCMToken(uid, token);
      } catch {
        // Notification permission denied or not supported
      }

      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        if (title && Notification.permission === 'granted') {
          new Notification(title, { body });
        }
      });
    };

    init();
  }, [uid]);
};
