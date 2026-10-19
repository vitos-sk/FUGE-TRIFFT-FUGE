import type { WorkHourEntry } from '@shared/types';

/** Entries saved on the phone while offline; they are sent once the connection is back. */
export type QueuedEntry = Omit<WorkHourEntry, 'id' | 'createdAt' | 'totalMinutes'>;

const QUEUE_KEY = 'pendingHoursQueue';

export const loadQueue = (): QueuedEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const saveQueue = (queue: QueuedEntry[]): void => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const enqueueEntry = (entry: QueuedEntry): void => {
  saveQueue([...loadQueue(), entry]);
};
