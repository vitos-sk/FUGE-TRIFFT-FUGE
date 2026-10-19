import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { deleteHourEntry } from '@features/hours/services';
import { useAuth } from '@features/auth/hooks';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import type { WorkHourEntry } from '@shared/types';
import { useMonthHours } from './useMonthHours';
import { useHoursUsers } from './useHoursUsers';
import { useHoursQueueSync } from './useHoursQueueSync';
import { currentMonth, isValidMonth, formatMonthTitle, formatMonthRange } from '../utils/monthUtils';
import { formatHM, formatShiftCount, parseIsoDate } from '../utils/timeUtils';
import { buildReport, exportExcel, sumMinutes } from '../utils/hoursReport';
import type { HoursScope, FilterOption } from '../types';

export const PAGE_SIZE = 50;

const ALL_USERS = '';
const ALL_OBJECTS = '';

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

/** Newest day first; inside a day the entry added last comes first. */
const newestFirst = (a: WorkHourEntry, b: WorkHourEntry): number =>
  b.date.localeCompare(a.date) ||
  (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);

const statsSub = (entries: WorkHourEntry[]): string =>
  `${formatShiftCount(entries.length)} · ${formatHM(sumMinutes(entries))}`;

export const useHoursPage = () => {
  const { isAdmin, uid, user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // The month lives in the URL, so it survives navigating to the form / calculator and back
  const rawMonth = params.get('month');
  const month = isValidMonth(rawMonth) ? rawMonth : currentMonth();

  const [scope, setScope] = useState<HoursScope>('team');
  const [userFilter, setUserFilter] = useState(ALL_USERS);
  const [objectFilter, setObjectFilter] = useState(ALL_OBJECTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [copied, setCopied] = useState(false);

  const users = useHoursUsers(isAdmin);
  const { entries, loading, refreshing, failed, reload, retry } = useMonthHours(month);
  const { pendingCount, isOnline } = useHoursQueueSync(reload);

  // ── Navigation / filter changes always go back to the first page ───────────
  const resetList = () => {
    setLimit(PAGE_SIZE);
    setExpandedId(null);
  };

  const changeMonth = (next: string) => {
    resetList();
    setParams({ month: next }, { replace: true });
  };
  const changeScope = (next: HoursScope) => {
    resetList();
    setScope(next);
    setUserFilter(ALL_USERS);
    setObjectFilter(ALL_OBJECTS);
  };
  const changeUserFilter = (next: string) => {
    resetList();
    setUserFilter(next);
  };
  const changeObjectFilter = (next: string) => {
    resetList();
    setObjectFilter(next);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const scoped = useMemo(
    () => (isAdmin && scope === 'me' ? entries.filter((e) => e.userId === uid) : entries),
    [entries, isAdmin, scope, uid],
  );

  const visible = useMemo(
    () =>
      scoped
        .filter((e) => !userFilter || e.userId === userFilter)
        .filter((e) => !objectFilter || e.objectId === objectFilter)
        .sort(newestFirst),
    [scoped, userFilter, objectFilter],
  );

  // The numbers in each filter depend on the other filter, so they always match
  // what the boss sees after tapping the row.
  const userOptions = useMemo<FilterOption[]>(() => {
    const base = scoped.filter((e) => !objectFilter || e.objectId === objectFilter);
    const people = new Map<string, string>(users.map((u) => [u.uid, u.name]));
    base.forEach((e) => {
      if (!people.has(e.userId)) people.set(e.userId, e.userName);
    });
    return [
      { value: ALL_USERS, label: 'Alle Mitarbeiter', sub: statsSub(base) },
      ...[...people.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({
          value,
          label,
          initials: initialsOf(label),
          sub: statsSub(base.filter((e) => e.userId === value)),
        })),
    ];
  }, [scoped, users, objectFilter]);

  const objectOptions = useMemo<FilterOption[]>(() => {
    const base = scoped.filter((e) => !userFilter || e.userId === userFilter);
    const objects = new Map<string, string>();
    base.forEach((e) => {
      if (e.objectId) objects.set(e.objectId, e.objectTitle || e.objectId);
    });
    // keep the selected object visible even when the other filter hides all its shifts
    if (objectFilter && !objects.has(objectFilter)) {
      const known = scoped.find((e) => e.objectId === objectFilter);
      objects.set(objectFilter, known?.objectTitle || objectFilter);
    }
    return [
      { value: ALL_OBJECTS, label: 'Alle Objekte', sub: statsSub(base) },
      ...[...objects.entries()]
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({
          value,
          label,
          sub: statsSub(base.filter((e) => e.objectId === value)),
        })),
    ];
  }, [scoped, userFilter, objectFilter]);

  const userFilterLabel = userOptions.find((o) => o.value === userFilter)?.label ?? 'Alle Mitarbeiter';
  const objectFilterLabel =
    objectOptions.find((o) => o.value === objectFilter)?.label ?? 'Alle Objekte';

  const totalMins = sumMinutes(visible);
  const isFiltered = !!userFilter || !!objectFilter;
  const showWorker = isAdmin && scope === 'team' && !userFilter;

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleExpanded = (id: string) => setExpandedId((cur) => (cur === id ? null : id));
  const showMore = () => setLimit((l) => l + PAGE_SIZE);

  const goToNew = () => navigate('/hours/new');
  const goToEdit = (id: string) => navigate(`/hours/${id}/edit`);
  const goToWage = () => navigate(`/hours/wage?month=${month}`);

  const deleteEntry = async (entry: WorkHourEntry) => {
    const dateLabel = format(parseIsoDate(entry.date), 'dd.MM.yyyy');
    const ok = await confirm({
      title: 'Eintrag löschen',
      message: `Stundeneintrag vom ${dateLabel} wirklich löschen? Das kann nicht rückgängig gemacht werden.`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    if (!navigator.onLine) {
      toast.error('Löschen ist ohne Internet nicht möglich.');
      return;
    }
    try {
      await deleteHourEntry(entry.id);
      toast.success('Eintrag gelöscht');
      setExpandedId(null);
      await reload();
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const workerLabel = (): string => {
    if (!isAdmin) return user?.name ?? '';
    if (scope === 'me') return user?.name ?? '';
    return userFilter ? userFilterLabel : '';
  };

  const copyReport = () => {
    navigator.clipboard.writeText(buildReport(visible, formatMonthRange(month), workerLabel()));
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  const exportToExcel = useCallback(() => {
    exportExcel(visible, formatMonthTitle(month).replace(' ', '_')).catch(() =>
      toast.error('Export fehlgeschlagen.'),
    );
  }, [visible, month, toast]);

  return {
    isAdmin,
    uid,
    month,
    changeMonth,
    scope,
    changeScope,
    userFilter,
    changeUserFilter,
    objectFilter,
    changeObjectFilter,
    userOptions,
    objectOptions,
    userFilterLabel,
    objectFilterLabel,
    visible,
    limit,
    showMore,
    totalMins,
    isFiltered,
    showWorker,
    loading,
    refreshing,
    failed,
    retry,
    isOnline,
    pendingCount,
    expandedId,
    toggleExpanded,
    copied,
    copyReport,
    exportToExcel,
    goToNew,
    goToEdit,
    goToWage,
    deleteEntry,
  };
};
