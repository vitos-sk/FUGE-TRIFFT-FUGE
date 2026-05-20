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
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from './firebase';
import type { Photo, PhotoType } from '../types';

async function compressToJpeg(file: File): Promise<Blob> {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: false,
      fileType: 'image/jpeg',
      initialQuality: 0.85,
    });
    return compressed;
  } catch {
    return file;
  }
}

export const subscribeToPhotos = (
  objectId: string,
  onData: (photos: Photo[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(
    collection(db, 'objects', objectId, 'photos'),
    orderBy('uploadedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photo));
    onData(photos);
  }, onError);
};

export const uploadPhoto = async (
  objectId: string,
  file: File,
  type: PhotoType,
  caption: string,
  uploadedBy: string,
  uploadedByName: string,
  onProgress?: (pct: number) => void,
  objectTitle?: string,
): Promise<Photo> => {
  const blob = await compressToJpeg(file);
  onProgress?.(5);

  const storagePath = `objects/${objectId}/photos/${Date.now()}.jpg`;
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
          const docRef = await addDoc(collection(db, 'objects', objectId, 'photos'), {
            url,
            storagePath,
            caption,
            type,
            uploadedBy,
            uploadedByName,
            uploadedAt: now,
          });
          onProgress?.(100);

          // Notify all other users
          try {
            const typeLabels: Record<PhotoType, string> = {
              daily: 'Täglich', before: 'Vorher', after: 'Nachher', problem: 'Problem',
            };
            const usersSnap = await getDocs(collection(db, 'users'));
            const batch = writeBatch(db);
            const title = `Neues Foto — ${objectTitle || 'Objekt'}`;
            const body = `${uploadedByName}: ${caption || typeLabels[type]}`;
            usersSnap.docs.forEach((userDoc) => {
              if (userDoc.id === uploadedBy) return;
              const notifRef = doc(collection(db, 'notifications', userDoc.id, 'items'));
              batch.set(notifRef, {
                title,
                body,
                objectId,
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
            type,
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

export const deletePhoto = async (objectId: string, photo: Photo): Promise<void> => {
  await deleteDoc(doc(db, 'objects', objectId, 'photos', photo.id));
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
