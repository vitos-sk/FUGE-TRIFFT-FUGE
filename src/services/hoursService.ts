import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  deleteDoc,
  updateDoc,
  doc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import type { WorkHourEntry } from '../types';

const calculateMinutes = (start: string, end: string, breakMins: number): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm) - breakMins);
};

const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

export const addHourEntry = async (
  entry: Omit<WorkHourEntry, 'id' | 'createdAt' | 'totalMinutes'>
) => {
  const totalMinutes = calculateMinutes(entry.startTime, entry.endTime, entry.breakMinutes);
  const cleanEntry = Object.fromEntries(
    Object.entries({ ...entry, totalMinutes, createdAt: Timestamp.now() })
      .filter(([, v]) => v !== undefined)
  );
  return addDoc(collection(db, 'workHours'), cleanEntry);
};

// Worker: own entries only, date range pushed to Firestore.
// Requires composite index: userId ASC + date ASC (see firestore.indexes.json).
export const getHoursForUser = async (userId: string, from?: Date, to?: Date): Promise<WorkHourEntry[]> => {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];
  if (from) constraints.push(where('date', '>=', toDateStr(from)));
  if (to)   constraints.push(where('date', '<=', toDateStr(to)));
  constraints.push(orderBy('date', 'desc'));

  const snap = await getDocs(query(collection(db, 'workHours'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry));
};

// Admin: all entries, date range pushed to Firestore.
export const getAllHours = async (from?: Date, to?: Date): Promise<WorkHourEntry[]> => {
  const constraints: QueryConstraint[] = [];
  if (from) constraints.push(where('date', '>=', toDateStr(from)));
  if (to)   constraints.push(where('date', '<=', toDateStr(to)));
  constraints.push(orderBy('date', 'desc'));

  const snap = await getDocs(query(collection(db, 'workHours'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry));
};

export const deleteHourEntry = async (id: string) => deleteDoc(doc(db, 'workHours', id));

export const updateHourEntry = async (
  id: string,
  data: Pick<WorkHourEntry, 'date' | 'startTime' | 'endTime' | 'breakMinutes' | 'totalMinutes'> & {
    objectId?: string | null;
    objectTitle?: string;
  }
) => updateDoc(doc(db, 'workHours', id), data as Record<string, unknown>);
