import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId:             import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};
