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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@shared/services/firebase';
import { compressToJpeg } from './compressImage';
import type { PhotoComparison } from '@shared/types';

export const uploadComparisonImage = async (
  objectId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> => {
  const blob = await compressToJpeg(file);
  const storagePath = `objects/${objectId}/comparisons/${Date.now()}.jpg`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });

    task.on(
      'state_changed',
      (snap) => {
        onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

export const subscribeToComparisons = (
  objectId: string,
  onData: (comparisons: PhotoComparison[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(
    collection(db, 'objects', objectId, 'comparisons'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const comparisons = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PhotoComparison));
    onData(comparisons);
  }, onError);
};

export const createComparison = async (
  objectId: string,
  beforeUrl: string,
  afterUrl: string,
  createdBy: string,
  createdByName: string,
): Promise<void> => {
  await addDoc(collection(db, 'objects', objectId, 'comparisons'), {
    beforeUrl,
    afterUrl,
    createdBy,
    createdByName,
    createdAt: Timestamp.now(),
  });
};

export const deleteComparison = async (objectId: string, comparisonId: string): Promise<void> => {
  await deleteDoc(doc(db, 'objects', objectId, 'comparisons', comparisonId));
};
