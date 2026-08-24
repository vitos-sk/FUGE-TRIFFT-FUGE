import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  getDocs,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@shared/services/firebase';
import { compressToJpeg } from './compressImage';
import type { Photo } from '@shared/types';

export const subscribeToPhotos = (
  basePath: string,
  id: string,
  onData: (photos: Photo[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(
    collection(db, basePath, id, 'photos'),
    orderBy('uploadedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photo));
    onData(photos);
  }, onError);
};

export const uploadPhoto = async (
  basePath: string,
  id: string,
  file: File,
  caption: string,
  uploadedBy: string,
  uploadedByName: string,
  onProgress?: (pct: number) => void,
  title?: string,
): Promise<Photo> => {
  const blob = await compressToJpeg(file);
  onProgress?.(5);

  const storagePath = `${basePath}/${id}/photos/${Date.now()}.jpg`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 90);
        onProgress?.(5 + pct);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          const now = Timestamp.now();
          const docRef = await addDoc(collection(db, basePath, id, 'photos'), {
            url,
            storagePath,
            caption,
            uploadedBy,
            uploadedByName,
            uploadedAt: now,
          });
          await updateDoc(doc(db, basePath, id), { lastActivityAt: now });
          onProgress?.(100);

          // Notify all other users
          try {
            const usersSnap = await getDocs(collection(db, 'users'));
            const batch = writeBatch(db);
            const entityLabel = basePath === 'objects' ? title || 'Objekt' : title || 'Aufgabe';
            const notifTitle = `Neues Foto — ${entityLabel}`;
            const body = `${uploadedByName}: ${caption || 'Neues Foto'}`;
            usersSnap.docs.forEach((userDoc) => {
              if (userDoc.id === uploadedBy) return;
              const notifRef = doc(collection(db, 'notifications', userDoc.id, 'items'));
              batch.set(notifRef, {
                title: notifTitle,
                body,
                ...(basePath === 'objects' ? { objectId: id } : { taskId: id }),
                photoId: docRef.id,
                read: false,
                createdAt: now,
              });
            });
            await batch.commit();
          } catch (err) {
            console.error('[photosService] failed to send notifications:', err);
          }

          resolve({
            id: docRef.id,
            url,
            storagePath,
            caption,
            uploadedBy,
            uploadedByName,
            uploadedAt: now,
          });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

export const deletePhoto = async (basePath: string, id: string, photo: Photo): Promise<void> => {
  await deleteDoc(doc(db, basePath, id, 'photos', photo.id));
  const path = photo.storagePath ?? extractStoragePath(photo.url);
  if (path) {
    await deleteObject(ref(storage, path)).catch(() => {});
  }

  // Remove notifications about this photo from all users
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const batch = writeBatch(db);
    await Promise.all(usersSnap.docs.map(async (userDoc) => {
      const notifSnap = await getDocs(
        query(collection(db, 'notifications', userDoc.id, 'items'), where('photoId', '==', photo.id))
      );
      notifSnap.docs.forEach((d) => batch.delete(d.ref));
    }));
    await batch.commit();
  } catch (err) {
    console.error('[photosService] failed to delete photo notifications:', err);
  }
};

const extractStoragePath = (url: string): string | null => {
  try {
    const match = url.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};
