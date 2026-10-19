import { useState, useEffect, useCallback, useRef } from 'react';
import { addHourEntry } from '@features/hours/services';
import { useToast } from '@shared/ui/Toast';
import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';
import { loadQueue, saveQueue } from '../utils/hoursQueue';

/**
 * Sends entries that were saved offline as soon as the connection is back.
 * `onSynced` is called after at least one entry went through (to refresh the list).
 */
export const useHoursQueueSync = (onSynced?: () => void) => {
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(() => loadQueue().length);
  const flushingRef = useRef(false);

  const flush = useCallback(async () => {
    if (flushingRef.current) return;
    const queue = loadQueue();
    if (queue.length === 0) return;
    flushingRef.current = true;
    try {
      const failed: typeof queue = [];
      for (const entry of queue) {
        try {
          await addHourEntry(entry);
        } catch {
          failed.push(entry);
        }
      }
      saveQueue(failed);
      setPendingCount(failed.length);
      const synced = queue.length - failed.length;
      if (synced > 0) {
        toast.success(
          synced === 1
            ? '1 gespeicherter Eintrag wurde übertragen'
            : `${synced} gespeicherte Einträge wurden übertragen`,
        );
        onSynced?.();
      }
    } finally {
      flushingRef.current = false;
    }
  }, [toast, onSynced]);

  useEffect(() => {
    if (isOnline) flush();
  }, [isOnline, flush]);

  return { pendingCount, isOnline };
};
