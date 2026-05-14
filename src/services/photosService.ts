import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import type { Photo, PhotoType } from '../types';

// Native canvas compression — works on all mobile browsers without Web Workers.
// Falls back to original file if canvas is unavailable or image can't be decoded.
function compressToJpeg(file: File, maxMB: number, maxPx: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);

      const maxBytes = maxMB * 1024 * 1024;
      let quality = 0.85;

      const attempt = () => {
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          if (blob.size <= maxBytes || quality <= 0.3) {
            resolve(blob);
          } else {
            quality = Math.max(0.3, quality - 0.1);
            attempt();
          }
        }, 'image/jpeg', quality);
      };
      attempt();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // upload original if decode fails
    };

    img.src = objectUrl;
  });
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
  onProgress?: (pct: number) => void
): Promise<Photo> => {
  // Step 1: compress (async, non-blocking via canvas)
  const blob = await compressToJpeg(file, 2, 2048);
  onProgress?.(5); // compression done

  // Step 2: upload with real progress tracking
  const storagePath = `objects/${objectId}/photos/${Date.now()}.jpg`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });

    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 90);
        onProgress?.(5 + pct); // 5–95%
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
};

const extractStoragePath = (url: string): string | null => {
  try {
    const match = url.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};
