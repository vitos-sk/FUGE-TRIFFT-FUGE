import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { WorkHourEntry } from '../types';

const calculateMinutes = (start: string, end: string, breakMins: number): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm) - breakMins);
};

const sortByDate = (a: WorkHourEntry, b: WorkHourEntry) => b.date.localeCompare(a.date);

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

export const getHoursForUser = async (userId: string, from?: Date, to?: Date): Promise<WorkHourEntry[]> => {
  const q = query(collection(db, 'workHours'), where('userId', '==', userId));
  const snap = await getDocs(q);
  let entries = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry));

  if (from) entries = entries.filter((e) => e.date >= from.toISOString().slice(0, 10));
  if (to)   entries = entries.filter((e) => e.date <= to.toISOString().slice(0, 10));

  return entries.sort(sortByDate);
};

export const getAllHours = async (from?: Date, to?: Date): Promise<WorkHourEntry[]> => {
  const snap = await getDocs(collection(db, 'workHours'));
  let entries = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry));

  if (from) entries = entries.filter((e) => e.date >= from.toISOString().slice(0, 10));
  if (to)   entries = entries.filter((e) => e.date <= to.toISOString().slice(0, 10));

  return entries.sort(sortByDate);
};

export const deleteHourEntry = async (id: string) => deleteDoc(doc(db, 'workHours', id));
