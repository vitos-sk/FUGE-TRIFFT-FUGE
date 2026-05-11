import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Notification } from '../types';

export const subscribeToNotifications = (
  uid: string,
  onData: (notifs: Notification[]) => void
) => {
  const q = query(
    collection(db, 'notifications', uid, 'items'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
    onData(notifs);
  });
};

export const markNotificationRead = async (uid: string, notifId: string) =>
  updateDoc(doc(db, 'notifications', uid, 'items', notifId), { read: true });

export const deleteNotification = async (uid: string, notifId: string) =>
  deleteDoc(doc(db, 'notifications', uid, 'items', notifId));

export const markAllRead = async (uid: string) => {
  const q = query(
    collection(db, 'notifications', uid, 'items'),
    where('read', '==', false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
};

export const createNotification = async (
  uid: string,
  title: string,
  body: string,
  objectId?: string
) => {
  await addDoc(collection(db, 'notifications', uid, 'items'), {
    title,
    body,
    objectId: objectId || null,
    read: false,
    createdAt: Timestamp.now(),
  });
};
