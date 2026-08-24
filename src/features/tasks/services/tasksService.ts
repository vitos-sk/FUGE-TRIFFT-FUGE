import {
  collection,
  doc,
  addDoc,
  updateDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@shared/services/firebase';
import type { Task } from '@shared/types';
import { TASK_STATUS } from '@constants';

const assertValidLocation = (data: Pick<Task, 'objectId' | 'customLocation'>) => {
  if (data.objectId === null && !data.customLocation?.trim()) {
    throw new Error('customLocation is required when objectId is null');
  }
};

export const subscribeToTasks = (
  onData: (tasks: Task[]) => void,
  onError?: (e: Error) => void
) => {
  const q = query(collection(db, 'tasks'), orderBy('startAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
      onData(tasks);
    },
    onError
  );
};

export const createTask = async (data: Omit<Task, 'id' | 'createdAt'>) => {
  assertValidLocation(data);
  return addDoc(collection(db, 'tasks'), {
    ...data,
    createdAt: Timestamp.now(),
  });
};

export const updateTask = async (id: string, patch: Partial<Task>) => {
  if ('objectId' in patch || 'customLocation' in patch) {
    assertValidLocation({
      objectId: patch.objectId ?? null,
      customLocation: patch.customLocation,
    });
  }
  return updateDoc(doc(db, 'tasks', id), patch as Record<string, unknown>);
};

export const completeTask = async (id: string) =>
  updateDoc(doc(db, 'tasks', id), { status: TASK_STATUS.DONE });
