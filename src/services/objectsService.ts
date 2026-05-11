import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CRMObject, ObjectStatus, Material, ChecklistItem } from '../types';

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
  data: Omit<CRMObject, 'id' | 'createdAt' | 'materials' | 'checklist'>,
  uid: string
) => {
  return addDoc(collection(db, 'objects'), {
    ...data,
    createdBy: uid,
    createdAt: Timestamp.now(),
    materials: [],
    checklist: [],
    noteCount: 0,
  });
};

export const updateObject = async (id: string, data: Partial<CRMObject>) =>
  updateDoc(doc(db, 'objects', id), data as Record<string, unknown>);

export const deleteObject = async (id: string) => deleteDoc(doc(db, 'objects', id));

export const updateObjectStatus = async (id: string, status: ObjectStatus) =>
  updateDoc(doc(db, 'objects', id), { status });

export const updateMaterials = async (id: string, materials: Material[]) =>
  updateDoc(doc(db, 'objects', id), { materials });

export const updateChecklist = async (id: string, checklist: ChecklistItem[]) =>
  updateDoc(doc(db, 'objects', id), { checklist });
