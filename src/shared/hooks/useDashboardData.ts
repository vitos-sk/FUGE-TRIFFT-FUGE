import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { subDays, format } from 'date-fns';
import { db } from '@shared/services/firebase';
import { getAllUsers } from '@features/auth/services';
import type { WorkHourEntry, AppUser } from '@shared/types';

export const useDashboardData = () => {
  const [hours, setHours] = useState<WorkHourEntry[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((u) => setUsers(u.filter((x) => !x.disabled)));
  }, []);

  useEffect(() => {
    const from = format(subDays(new Date(), 29), 'yyyy-MM-dd');
    const q = query(collection(db, 'workHours'), where('date', '>=', from));
    const unsub = onSnapshot(q, (snap) => {
      setHours(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WorkHourEntry));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { hours, users, loading };
};
