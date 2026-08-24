import { useEffect, useMemo, useRef, useState } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@shared/services/firebase';
import { getAllUsers } from '@features/auth/services';
import { getAllHours, getAllHoursFromCache } from '@features/hours/services';
import { subscribeToTasks } from '@features/tasks/services';
import { useObjects } from '@features/objects/hooks';
import { getDashboardBounds, getBuckets } from '@features/dashboard/utils/period';
import { filterRange } from '@features/dashboard/utils/aggregate';
import type { DashboardPeriod } from '@features/dashboard/utils/period';
import type { WorkHourEntry, AppUser, Task } from '@shared/types';

const toDate = (iso: string): Date => new Date(iso + 'T12:00:00');

/** Stabile Referenz, solange der Zeitraum noch nicht geladen ist. */
const EMPTY: WorkHourEntry[] = [];

/** Kurze Zeiträume laufen live – wichtig für die "Heute"-Karte. */
const isRealtime = (period: DashboardPeriod): boolean =>
  period === 'week' || period === 'month';

export const useDashboardData = (period: DashboardPeriod) => {
  const bounds = useMemo(() => getDashboardBounds(period), [period]);
  const buckets = useMemo(() => getBuckets(bounds), [bounds]);

  const { prevStart, start, end, prevEnd } = bounds;
  const rangeKey = `${prevStart}_${end}`;
  const realtime = isRealtime(period);

  // Bereits geladene Zeiträume – Zurückwechseln zeigt sofort Daten statt Skeleton.
  const cache = useRef(new Map<string, WorkHourEntry[]>());
  const [store, setStore] = useState<{ key: string; entries: WorkHourEntry[] } | null>(null);
  const [refreshing, setRefreshing] = useState(true);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { objects } = useObjects();

  useEffect(() => {
    getAllUsers()
      .then((all) => setUsers(all.filter((u) => !u.disabled)))
      .catch(() => {});
  }, []);

  useEffect(() => subscribeToTasks(setTasks, () => {}), []);

  useEffect(() => {
    const cached = cache.current.get(rangeKey);
    if (cached) setStore({ key: rangeKey, entries: cached });
    setRefreshing(true);

    const commit = (entries: WorkHourEntry[]) => {
      cache.current.set(rangeKey, entries);
      setStore({ key: rangeKey, entries });
      setRefreshing(false);
    };

    if (realtime) {
      const q = query(
        collection(db, 'workHours'),
        where('date', '>=', prevStart),
        where('date', '<=', end)
      );
      return onSnapshot(
        q,
        (snap) =>
          commit(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WorkHourEntry)),
        () => setRefreshing(false)
      );
    }

    // Große Zeiträume: erst lokaler Firestore-Cache, dann Server.
    let cancelled = false;
    const from = toDate(prevStart);
    const to = toDate(end);

    (async () => {
      if (!cached) {
        try {
          const local = await getAllHoursFromCache(from, to);
          if (!cancelled && local.length) setStore({ key: rangeKey, entries: local });
        } catch {
          // kein lokaler Cache – direkt vom Server
        }
      }
      try {
        const fresh = await getAllHours(from, to);
        if (!cancelled) commit(fresh);
      } catch {
        if (!cancelled) setRefreshing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rangeKey, realtime, prevStart, end]);

  const ready = store?.key === rangeKey;
  const entries = useMemo(
    () => (store?.key === rangeKey ? store.entries : EMPTY),
    [store, rangeKey]
  );

  const curHours = useMemo(
    () => filterRange(entries, start, end),
    [entries, start, end]
  );
  const prevHours = useMemo(
    () => filterRange(entries, prevStart, prevEnd),
    [entries, prevStart, prevEnd]
  );

  return {
    curHours,
    prevHours,
    users,
    objects,
    tasks,
    bounds,
    buckets,
    loading: !ready,
    refreshing,
  };
};
