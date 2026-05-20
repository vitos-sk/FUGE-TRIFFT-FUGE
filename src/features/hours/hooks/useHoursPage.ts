import { useState, useEffect, useCallback } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { getAllHours, getHoursForUser } from '@shared/services/hoursService';
import { getAllUsers } from '@shared/services/authService';
import { useAuth } from '@shared/hooks/useAuth';
import type { WorkHourEntry, AppUser } from '@shared/types';

type RangePreset = 'week' | 'month' | 'all' | 'custom';

const exportExcel = (entries: WorkHourEntry[], monthLabel: string) => {
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalH = Math.floor(totalMins / 60);
  const totalM = totalMins % 60;

  const rows = entries.map((e) => {
    const h = Math.floor(e.totalMinutes / 60);
    const m = e.totalMinutes % 60;
    return {
      'Mitarbeiter': e.userName,
      'Objekt': e.objectTitle ?? '—',
      'Datum': e.date,
      'Stunden': `${h}:${String(m).padStart(2, '0')}`,
    };
  });

  rows.push({
    'Mitarbeiter': 'GESAMT',
    'Objekt': '',
    'Datum': '',
    'Stunden': `${totalH}:${String(totalM).padStart(2, '0')}`,
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 24 }, { wch: 28 }, { wch: 14 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Stunden');

  XLSX.writeFile(wb, `Bericht_${monthLabel}.xlsx`);
};

export const useHoursPage = () => {
  const { isAdmin, uid } = useAuth();
  const [tab, setTab] = useState<'add' | 'view'>(isAdmin ? 'view' : 'add');
  const [entries, setEntries] = useState<WorkHourEntry[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [range, setRange] = useState<RangePreset>('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportMonth, setExportMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    if (isAdmin) {
      getAllUsers().then((u) => setUsers(u.filter((x) => x.role === 'worker' || x.role === 'admin')));
    }
  }, [isAdmin]);

  const getDateRange = (): [Date | undefined, Date | undefined] => {
    const now = new Date();
    if (range === 'week') return [startOfWeek(now, { locale: de }), endOfWeek(now, { locale: de })];
    if (range === 'month') return [startOfMonth(now), endOfMonth(now)];
    if (range === 'all') return [undefined, undefined];
    if (customFrom && customTo) return [new Date(customFrom), new Date(customTo)];
    return [startOfWeek(now, { locale: de }), endOfWeek(now, { locale: de })];
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [from, to] = getDateRange();
    try {
      if (isAdmin) {
        const all = await getAllHours(from, to);
        const filtered = selectedUser ? all.filter((e) => e.userId === selectedUser) : all;
        setEntries(filtered);
      } else if (uid) {
        const own = await getHoursForUser(uid, from, to);
        setEntries(own);
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, uid, range, selectedUser, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [load]);

  const exportToExcel = async () => {
    const [year, month] = exportMonth.split('-').map(Number);
    const from = startOfMonth(new Date(year, month - 1));
    const to = endOfMonth(new Date(year, month - 1));
    const all = await getAllHours(from, to);
    const filtered = selectedUser ? all.filter((e) => e.userId === selectedUser) : all;
    const label = format(new Date(year, month - 1), 'MMMM_yyyy', { locale: de });
    exportExcel(filtered, label);
  };

  return {
    isAdmin,
    tab,
    setTab,
    entries,
    users,
    selectedUser,
    setSelectedUser,
    range,
    setRange,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    loading,
    exportMonth,
    setExportMonth,
    load,
    exportToExcel,
  };
};
