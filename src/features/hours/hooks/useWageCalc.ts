import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks';
import { useMonthHours } from './useMonthHours';
import { useHoursUsers } from './useHoursUsers';
import { currentMonth, isValidMonth, formatMonthRange } from '../utils/monthUtils';
import { formatHM, formatShiftCount } from '../utils/timeUtils';
import { buildWageReport, sumMinutes, type WageBlock } from '../utils/hoursReport';
import type { FilterOption } from '../types';

const ALL_USERS = '';

const parseRate = (raw: string): number => {
  const n = parseFloat(raw.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Wage calculator for one month. Counts only the shifts that exist (all are closed).
 * The hourly rate is never saved anywhere — it lives only while the page is open.
 */
export const useWageCalc = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const rawMonth = params.get('month');
  const month = isValidMonth(rawMonth) ? rawMonth : currentMonth();

  const [rateInput, setRateInput] = useState('');
  const [userFilter, setUserFilter] = useState(ALL_USERS);
  const [copied, setCopied] = useState(false);

  const users = useHoursUsers(isAdmin);
  const { entries, loading, failed, retry } = useMonthHours(month);

  const rate = parseRate(rateInput);
  const periodLabel = formatMonthRange(month);

  const blocks = useMemo<WageBlock[]>(() => {
    const byUser = new Map<string, WageBlock>();
    entries
      .filter((e) => !userFilter || e.userId === userFilter)
      .forEach((e) => {
        const block = byUser.get(e.userId) ?? { userName: e.userName, entries: [], mins: 0 };
        block.entries.push(e);
        block.mins += e.totalMinutes || 0;
        byUser.set(e.userId, block);
      });
    return [...byUser.values()].sort((a, b) => a.userName.localeCompare(b.userName));
  }, [entries, userFilter]);

  const totalMins = blocks.reduce((acc, b) => acc + b.mins, 0);
  const earnings = rate > 0 ? (totalMins / 60) * rate : null;
  const report = useMemo(
    () => buildWageReport(blocks, periodLabel, rate),
    [blocks, periodLabel, rate],
  );

  const userOptions = useMemo<FilterOption[]>(() => {
    const people = new Map<string, string>(users.map((u) => [u.uid, u.name]));
    entries.forEach((e) => {
      if (!people.has(e.userId)) people.set(e.userId, e.userName);
    });
    const stats = (list: typeof entries) =>
      `${formatShiftCount(list.length)} · ${formatHM(sumMinutes(list))}`;
    return [
      { value: ALL_USERS, label: 'Alle Mitarbeiter', sub: stats(entries) },
      ...[...people.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({
          value,
          label,
          sub: stats(entries.filter((e) => e.userId === value)),
        })),
    ];
  }, [users, entries]);

  const userLabel = userOptions.find((o) => o.value === userFilter)?.label ?? 'Alle Mitarbeiter';

  const changeMonth = (next: string) => setParams({ month: next }, { replace: true });
  const goBack = () => navigate(`/hours?month=${month}`);

  const copyReport = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const shareReport = useCallback(async () => {
    try {
      await navigator.share({ text: report });
    } catch {
      // user closed the share sheet
    }
  }, [report]);

  return {
    isAdmin,
    month,
    changeMonth,
    goBack,
    rateInput,
    setRateInput,
    userFilter,
    setUserFilter,
    userOptions,
    userLabel,
    loading,
    failed,
    retry,
    blocks,
    totalMins,
    earnings,
    report,
    copied,
    copyReport,
    canShare,
    shareReport,
  };
};
