import { useState, useEffect, useCallback } from 'react';
import { addHourEntry } from '@features/hours/services';
import { subscribeToObjects } from '@features/objects/services';
import { useAuth } from '@features/auth/hooks';
import { useToast } from '@shared/ui/Toast';
import type { CRMObject } from '@shared/types';
import { calcMinutes } from '../utils/timeUtils';

const LONG_SHIFT_MINS = 12 * 60;
const QUEUE_KEY = 'pendingHoursQueue';

type QueuedEntry = Omit<Parameters<typeof addHourEntry>[0], never>;

const loadQueue = (): QueuedEntry[] => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]'); }
  catch { return []; }
};
const saveQueue = (q: QueuedEntry[]) => localStorage.setItem(QUEUE_KEY, JSON.stringify(q));

interface UseAddHoursFormProps {
  onAdded?: () => void;
}

export const useAddHoursForm = ({ onAdded }: UseAddHoursFormProps) => {
  const today = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMins, setBreakMins] = useState(30);
  const [objectId, setObjectId] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [locationNote, setLocationNote] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<QueuedEntry | null>(null);
  const [showLongShiftConfirm, setShowLongShiftConfirm] = useState(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [endPickerOpen, setEndPickerOpen] = useState(false);
  const [objectPickerOpen, setObjectPickerOpen] = useState(false);

  const { user, uid } = useAuth();
  const toast = useToast();

  const totalMins = calcMinutes(startTime, endTime, breakMins);

  const selectedObjTitle = objectId
    ? (objects.find((o) => o.id === objectId)?.title ?? objectId)
    : '⚠ kein Objekt';

  const pendingCount = loadQueue().length;

  useEffect(() => {
    const unsub = subscribeToObjects((data) => {
      const active = data.filter((o) => !o.archived);
      active.sort((a, b) => {
        const ta = (a.lastActivityAt ?? a.lastNoteAt ?? a.createdAt)?.toDate?.()?.getTime() ?? 0;
        const tb = (b.lastActivityAt ?? b.lastNoteAt ?? b.createdAt)?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setObjects(active);
    });
    return unsub;
  }, []);

  const flushQueue = useCallback(async () => {
    const queue = loadQueue();
    if (queue.length === 0) return;
    const failed: QueuedEntry[] = [];
    for (const entry of queue) {
      try { await addHourEntry(entry); }
      catch { failed.push(entry); }
    }
    saveQueue(failed);
    const synced = queue.length - failed.length;
    if (synced > 0) {
      toast.success(
        synced === 1
          ? '1 gespeicherter Eintrag wurde übertragen'
          : `${synced} gespeicherte Einträge wurden übertragen`
      );
    }
  }, [toast]);

  useEffect(() => {
    const onOnline = () => { setIsOnline(true); flushQueue(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    if (navigator.onLine) flushQueue();
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [flushQueue]);

  const resetForm = () => {
    setDate(today);
    setStartTime('07:00');
    setEndTime('17:00');
    setBreakMins(30);
    setObjectId('');
    setLocationNote('');
    setPendingEntry(null);
  };

  const saveEntry = async (entry: QueuedEntry) => {
    if (!navigator.onLine) {
      saveQueue([...loadQueue(), entry]);
      toast.success('Kein Internet – Eintrag gespeichert, wird automatisch übertragen');
      resetForm(); onAdded?.(); return;
    }
    setLoading(true);
    try {
      await addHourEntry(entry);
      toast.success('Stunden eingetragen');
      resetForm(); onAdded?.();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('offline') || msg.includes('network') || msg.includes('unavailable')) {
        saveQueue([...loadQueue(), entry]);
        toast.success('Kein Internet – Eintrag gespeichert, wird automatisch übertragen');
        resetForm(); onAdded?.();
      } else {
        setError(`Fehler: ${msg || 'Bitte erneut versuchen.'}`);
      }
    } finally { setLoading(false); }
  };

  const proceedWithEntry = async (entry: QueuedEntry) => {
    if (entry.objectId) { await saveEntry(entry); return; }
    setPendingEntry(entry);
    setLocationNote('');
    setShowLocationModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!uid) { setError('Fehler: Benutzer nicht angemeldet. Bitte neu einloggen.'); return; }

    const selectedObj = objects.find((o) => o.id === objectId);
    const entry: QueuedEntry = {
      userId: uid, userName: user?.name ?? uid,
      objectId: objectId || undefined,
      objectTitle: selectedObj?.title,
      date, startTime, endTime, breakMinutes: breakMins,
    };

    if (totalMins > LONG_SHIFT_MINS) {
      setPendingEntry(entry);
      setShowLongShiftConfirm(true);
      return;
    }

    await proceedWithEntry(entry);
  };

  const handleLongShiftConfirm = async () => {
    if (!pendingEntry) return;
    setShowLongShiftConfirm(false);
    await proceedWithEntry(pendingEntry);
  };

  const handleLocationConfirm = async () => {
    const note = locationNote.trim();
    if (!pendingEntry || !note) return;
    await saveEntry({ ...pendingEntry, objectId: undefined, objectTitle: note });
    setShowLocationModal(false);
  };

  return {
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    breakMins, setBreakMins,
    objectId, setObjectId,
    objects,
    loading,
    error,
    isOnline,
    locationNote, setLocationNote,
    showLocationModal, setShowLocationModal,
    pendingEntry,
    showLongShiftConfirm, setShowLongShiftConfirm,
    datePickerOpen, setDatePickerOpen,
    startPickerOpen, setStartPickerOpen,
    endPickerOpen, setEndPickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    totalMins,
    selectedObjTitle,
    pendingCount,
    uid,
    handleSubmit,
    handleLongShiftConfirm,
    handleLocationConfirm,
  };
};
