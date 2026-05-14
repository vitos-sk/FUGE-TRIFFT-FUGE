import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Photo, PhotoType } from '../types';
import imageCompression from 'browser-image-compression';

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
  uploadedByName: string
): Promise<Photo> => {
  const compressed = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: false,   // Web Workers hang silently on mobile Safari
    initialQuality: 0.85,
    fileType: 'image/jpeg', // normalize HEIC/HEIF from iPhone to JPEG
  });

  const storagePath = `objects/${objectId}/photos/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, compressed);
  const url = await getDownloadURL(storageRef);

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

  return { id: docRef.id, url, storagePath, caption, type, uploadedBy, uploadedByName, uploadedAt: now };
};

export const deletePhoto = async (objectId: string, photo: Photo): Promise<void> => {
  await deleteDoc(doc(db, 'objects', objectId, 'photos', photo.id));

  const path = photo.storagePath ?? extractStoragePath(photo.url);
  if (path) {
    await deleteObject(ref(storage, path)).catch(() => {});
  }
};

// Fallback for older photos saved before storagePath field was added.
const extractStoragePath = (url: string): string | null => {
  try {
    const match = url.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};
