import { useState, useEffect } from 'react';
import { getAllUsers } from '@features/auth/services';
import type { AppUser } from '@shared/types';

/** All people that can have hours (admin only — workers get an empty list). */
export const useHoursUsers = (enabled: boolean): AppUser[] => {
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getAllUsers()
      .then((all) => {
        if (!cancelled) setUsers(all.filter((u) => u.role === 'worker' || u.role === 'admin'));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return users;
};
