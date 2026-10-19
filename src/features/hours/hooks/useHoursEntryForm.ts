import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addHourEntry, getHourEntry, updateHourEntry } from '@features/hours/services';
import { useAuth } from '@features/auth/hooks';
import { useToast } from '@shared/ui/Toast';
import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';
import type { WorkHourEntry } from '@shared/types';
import { useActiveObjects } from './useActiveObjects';
import { calcMinutes, shiftTime, todayIso } from '../utils/timeUtils';
import { monthOfDate } from '../utils/monthUtils';
import { enqueueEntry, type QueuedEntry } from '../utils/hoursQueue';

const LONG_SHIFT_MINS = 12 * 60;
const TIME_STEP = 15;
const DEFAULT_START = '07:00';
const DEFAULT_END = '17:00';
const DEFAULT_BREAK = 30;

const OFFLINE_SAVED = 'Kein Internet – Eintrag gespeichert, wird automatisch übertragen';

const isNetworkError = (msg: string) =>
  msg.includes('offline') || msg.includes('network') || msg.includes('unavailable');

/** Form for adding a new shift, or (with `editId`) editing one of your own. */
export const useHoursEntryForm = (editId?: string) => {
  const { user, uid } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const objects = useActiveObjects();
  const isOnline = useOnlineStatus();
  const isEdit = !!editId;

  const [date, setDate] = useState(todayIso);
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [endTime, setEndTime] = useState(DEFAULT_END);
  const [breakMins, setBreakMins] = useState(DEFAULT_BREAK);
  const [objectId, setObjectId] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [original, setOriginal] = useState<WorkHourEntry | null>(null);

  const [loadingEntry, setLoadingEntry] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [longShiftOpen, setLongShiftOpen] = useState(false);
  const savingRef = useRef(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [endPickerOpen, setEndPickerOpen] = useState(false);
  const [objectPickerOpen, setObjectPickerOpen] = useState(false);

  // Edit mode: load the entry. Only your own entries can be changed.
  useEffect(() => {
    if (!editId || !uid) return;
    let cancelled = false;
    getHourEntry(editId)
      .then((entry) => {
        if (cancelled) return;
        if (!entry || entry.userId !== uid) {
          setNotFound(true);
        } else {
          setOriginal(entry);
          setDate(entry.date);
          setStartTime(entry.startTime);
          setEndTime(entry.endTime);
          setBreakMins(entry.breakMinutes);
          setObjectId(entry.objectId ?? '');
          setLocationNote(!entry.objectId && entry.objectTitle ? entry.objectTitle : '');
        }
        setLoadingEntry(false);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setLoadingEntry(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editId, uid]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalMins = calcMinutes(startTime, endTime, breakMins);
  const timeInvalid = totalMins <= 0;
  const placeMissing = !objectId && !locationNote.trim();
  const canSave = !!uid && !loadingEntry && !saving && !timeInvalid && !placeMissing;

  // The main button says what to fix while the form is not valid
  const submitLabel = timeInvalid
    ? 'Zeit korrigieren'
    : placeMissing
      ? 'Objekt oder Ort angeben'
      : 'Speichern';

  const selectedObject = objects.find((o) => o.id === objectId);
  const objectTitle = objectId
    ? (selectedObject?.title ??
        (original?.objectId === objectId ? original.objectTitle : undefined) ??
        objectId)
    : '';

  // ── Actions ────────────────────────────────────────────────────────────────
  const nudgeStart = (dir: 1 | -1) => setStartTime((t) => shiftTime(t, dir * TIME_STEP));
  const nudgeEnd = (dir: 1 | -1) => setEndTime((t) => shiftTime(t, dir * TIME_STEP));

  const goBack = () => {
    if (location.key !== 'default') navigate(-1);
    else navigate('/hours', { replace: true });
  };

  const saveNew = async (entry: QueuedEntry) => {
    if (!navigator.onLine) {
      enqueueEntry(entry);
      toast.success(OFFLINE_SAVED);
      return;
    }
    try {
      await addHourEntry(entry);
      toast.success('Stunden eingetragen');
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (!isNetworkError(msg)) throw err;
      enqueueEntry(entry);
      toast.success(OFFLINE_SAVED);
    }
  };

  const persist = async () => {
    if (savingRef.current || !uid) return; // second tap must not create a second entry
    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      const resolvedTitle = objectId
        ? (selectedObject?.title ??
          (original?.objectId === objectId ? original.objectTitle : undefined))
        : locationNote.trim();

      if (editId) {
        if (!navigator.onLine) {
          toast.error('Bearbeiten ist ohne Internet nicht möglich.');
          return;
        }
        await updateHourEntry(editId, {
          date,
          startTime,
          endTime,
          breakMinutes: breakMins,
          totalMinutes: totalMins,
          objectId: objectId || null,
          objectTitle: resolvedTitle,
        });
        toast.success('Stunden aktualisiert');
      } else {
        await saveNew({
          userId: uid,
          userName: user?.name ?? uid,
          objectId: objectId || undefined,
          objectTitle: resolvedTitle,
          date,
          startTime,
          endTime,
          breakMinutes: breakMins,
        });
      }
      navigate(`/hours?month=${monthOfDate(date)}`, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      setError(`Fehler: ${msg || 'Bitte erneut versuchen.'}`);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSave) return;
    if (totalMins > LONG_SHIFT_MINS) {
      setLongShiftOpen(true);
      return;
    }
    await persist();
  };

  const confirmLongShift = async () => {
    setLongShiftOpen(false);
    await persist();
  };

  return {
    isEdit,
    uid,
    isOnline,
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    breakMins, setBreakMins,
    objectId, setObjectId,
    locationNote, setLocationNote,
    objects,
    objectTitle,
    totalMins,
    timeInvalid,
    placeMissing,
    canSave,
    submitLabel,
    saving,
    loadingEntry,
    notFound,
    error,
    longShiftOpen, setLongShiftOpen,
    datePickerOpen, setDatePickerOpen,
    startPickerOpen, setStartPickerOpen,
    endPickerOpen, setEndPickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    nudgeStart,
    nudgeEnd,
    goBack,
    handleSubmit,
    confirmLongShift,
  };
};
