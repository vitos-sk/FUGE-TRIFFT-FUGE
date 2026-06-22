import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { ref, deleteObject as deleteStorageObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { CRMObject, Material } from '../types';

export const subscribeToObjects = (
  onData: (objects: CRMObject[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(collection(db, 'objects'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const objects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CRMObject));
      onData(objects);
    },
    onError
  );
};

export const getObject = async (id: string): Promise<CRMObject | null> => {
  const snap = await getDoc(doc(db, 'objects', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CRMObject;
};

export const createObject = async (
  data: Omit<CRMObject, 'id' | 'createdAt' | 'materials'>,
  uid: string
) => {
  return addDoc(collection(db, 'objects'), {
    ...data,
    createdBy: uid,
    createdAt: Timestamp.now(),
    materials: [],
    noteCount: 0,
  });
};

export const updateObject = async (id: string, data: Partial<CRMObject>) =>
  updateDoc(doc(db, 'objects', id), data as Record<string, unknown>);

export const deleteObject = async (id: string) => deleteDoc(doc(db, 'objects', id));

// Permanently deletes object + all notes + all photos (Firestore docs + Storage files).
export const deleteObjectPermanently = async (id: string): Promise<void> => {
  const [notesSnap, photosSnap] = await Promise.all([
    getDocs(collection(db, 'objects', id, 'notes')),
    getDocs(collection(db, 'objects', id, 'photos')),
  ]);

  // Delete Storage files for photos
  await Promise.all(
    photosSnap.docs.map((d) => {
      const path = (d.data().storagePath as string | undefined) ?? extractStoragePath(d.data().url as string);
      return path ? deleteStorageObject(ref(storage, path)).catch(() => {}) : Promise.resolve();
    })
  );

  // Batch delete all Firestore subcollection docs + the object doc
  const batch = writeBatch(db);
  notesSnap.docs.forEach((d) => batch.delete(d.ref));
  photosSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'objects', id));
  await batch.commit();
};

const extractStoragePath = (url: string): string | null => {
  try {
    const match = url?.match(/\/o\/(.+?)\?/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};

export const updateMaterials = async (id: string, materials: Material[]) =>
  updateDoc(doc(db, 'objects', id), { materials });

export const archiveObject = async (id: string) =>
  updateDoc(doc(db, 'objects', id), { archived: true, archivedAt: Timestamp.now() });

export const restoreObject = async (id: string) =>
  updateDoc(doc(db, 'objects', id), { archived: false, archivedAt: null });

export const subscribeToArchivedObjects = (
  onData: (objects: CRMObject[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(collection(db, 'objects'), orderBy('archivedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const objects = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as CRMObject))
        .filter((o) => o.archived === true);
      onData(objects);
    },
    onError
  );
};
