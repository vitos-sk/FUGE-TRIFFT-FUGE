import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getAllHours,
  getAllHoursFromCache,
  getHoursForUser,
  getHoursForUserFromCache,
} from '@features/hours/services';
import { useAuth } from '@features/auth/hooks';
import type { WorkHourEntry } from '@shared/types';
import { monthBounds } from '../utils/monthUtils';

interface MonthData {
  /** Which user / month this data belongs to — stale data is ignored after a switch. */
  key: string;
  entries: WorkHourEntry[];
  failed: boolean;
  refreshing: boolean;
}

const NO_ENTRIES: WorkHourEntry[] = [];

/**
 * All shifts of one month in a single request.
 * Admin gets the whole company, a worker only their own entries (Firestore rules decide).
 * Shows the local cache first, then replaces it with fresh data from the server.
 */
export const useMonthHours = (month: string) => {
  const { isAdmin, uid } = useAuth();
  const [data, setData] = useState<MonthData | null>(null);
  // Only the latest request may write state (fast month switching)
  const requestRef = useRef(0);

  const key = `${uid ?? ''}|${isAdmin ? 'admin' : 'worker'}|${month}`;
  // No data for the current month yet = loading (derived, nothing to reset on switch)
  const current = data?.key === key ? data : null;

  const load = useCallback(async () => {
    if (!uid) return;
    const requestId = ++requestRef.current;
    const isCurrent = () => requestId === requestRef.current;
    const [from, to] = monthBounds(month);
    let cachedEntries: WorkHourEntry[] | null = null;

    // Phase 1: local Firestore cache, so the screen is not empty offline
    try {
      const cached = isAdmin
        ? await getAllHoursFromCache(from, to)
        : await getHoursForUserFromCache(uid, from, to);
      if (isCurrent() && cached.length > 0) {
        cachedEntries = cached;
        setData({ key, entries: cached, failed: false, refreshing: true });
      }
    } catch {
      // cache miss
    }

    // Phase 2: fresh data from the server
    if (!isCurrent()) return;
    try {
      const fresh = isAdmin
        ? await getAllHours(from, to)
        : await getHoursForUser(uid, from, to);
      if (isCurrent()) setData({ key, entries: fresh, failed: false, refreshing: false });
    } catch {
      if (isCurrent()) {
        setData((prev) => ({
          key,
          entries: cachedEntries ?? (prev?.key === key ? prev.entries : NO_ENTRIES),
          failed: true,
          refreshing: false,
        }));
      }
    }
  }, [isAdmin, uid, month, key]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    entries: current?.entries ?? NO_ENTRIES,
    loading: !current,
    refreshing: current?.refreshing ?? false,
    failed: current?.failed ?? false,
    reload: load,
    retry: load,
  };
};
