import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDocsFromCache,
  Timestamp,
  deleteDoc,
  updateDoc,
  doc,
  QueryConstraint,
  Query,
} from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';

import { db } from '@shared/services/firebase';
import type { WorkHourEntry } from '@shared/types';

const calculateMinutes = (start: string, end: string, breakMins: number): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let endMins = eh * 60 + em;
  const startMins = sh * 60 + sm;
  if (endMins <= startMins) endMins += 24 * 60;
  return Math.max(0, endMins - startMins - breakMins);
};

const toDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const mapSnap = (snap: QuerySnapshot<DocumentData>): WorkHourEntry[] =>
  snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as WorkHourEntry));

const buildUserQuery = (userId: string, from?: Date, to?: Date): Query => {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];
  if (from) constraints.push(where('date', '>=', toDateStr(from)));
  if (to)   constraints.push(where('date', '<=', toDateStr(to)));
  constraints.push(orderBy('date', 'desc'));
  return query(collection(db, 'workHours'), ...constraints);
};

const buildAllQuery = (from?: Date, to?: Date): Query => {
  const constraints: QueryConstraint[] = [];
  if (from) constraints.push(where('date', '>=', toDateStr(from)));
  if (to)   constraints.push(where('date', '<=', toDateStr(to)));
  constraints.push(orderBy('date', 'desc'));
  return query(collection(db, 'workHours'), ...constraints);
};

export const addHourEntry = async (
  entry: Omit<WorkHourEntry, 'id' | 'createdAt' | 'totalMinutes'>
) => {
  const now = Timestamp.now();
  const totalMinutes = calculateMinutes(entry.startTime, entry.endTime, entry.breakMinutes);
  const cleanEntry = Object.fromEntries(
    Object.entries({ ...entry, totalMinutes, createdAt: now })
      .filter(([, v]) => v !== undefined)
  );
  const ref = await addDoc(collection(db, 'workHours'), cleanEntry);

  if (entry.objectId) {
    await updateDoc(doc(db, 'objects', entry.objectId), { lastActivityAt: now });
  }

  return ref;
};

// Worker: own entries only. Requires composite index: userId ASC + date ASC.
export const getHoursForUser = async (userId: string, from?: Date, to?: Date): Promise<WorkHourEntry[]> =>
  mapSnap(await getDocs(buildUserQuery(userId, from, to)));

export const getHoursForUserFromCache = async (userId: string, from?: Date, to?: Date): Promise<WorkHourEntry[]> =>
  mapSnap(await getDocsFromCache(buildUserQuery(userId, from, to)));

// Admin: all entries, date range pushed to Firestore.
export const getAllHours = async (from?: Date, to?: Date): Promise<WorkHourEntry[]> =>
  mapSnap(await getDocs(buildAllQuery(from, to)));

export const getAllHoursFromCache = async (from?: Date, to?: Date): Promise<WorkHourEntry[]> =>
  mapSnap(await getDocsFromCache(buildAllQuery(from, to)));

export const deleteHourEntry = async (id: string) => deleteDoc(doc(db, 'workHours', id));

export const updateHourEntry = async (
  id: string,
  data: Pick<WorkHourEntry, 'date' | 'startTime' | 'endTime' | 'breakMinutes' | 'totalMinutes'> & {
    objectId?: string | null;
    objectTitle?: string;
  }
) => updateDoc(doc(db, 'workHours', id), data as Record<string, unknown>);
