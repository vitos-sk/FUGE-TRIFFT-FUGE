import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  return onSnapshot(
    q,
    (snap) => {
      const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Photo));
      onData(photos);
    },
    onError
  );
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
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const storageRef = ref(storage, `objects/${objectId}/photos/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, compressed);
  const url = await getDownloadURL(storageRef);

  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'objects', objectId, 'photos'), {
    url,
    caption,
    type,
    uploadedBy,
    uploadedByName,
    uploadedAt: now,
  });

  return { id: docRef.id, url, caption, type, uploadedBy, uploadedByName, uploadedAt: now };
};
