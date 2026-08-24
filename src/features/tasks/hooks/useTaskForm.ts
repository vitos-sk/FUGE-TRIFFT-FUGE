import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToObjects } from '@features/objects/services';
import { getAllUsers } from '@features/auth/services';
import { ROLE, TASK_STATUS } from '@constants';
import type { CRMObject, AppUser, Task } from '@shared/types';

export type LocationMode = 'object' | 'custom';

const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toTime = (d: Date): string =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const todayIso = (): string => toIso(new Date());

interface UseTaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => Promise<void>;
}

export const useTaskForm = ({ initial, onSubmit }: UseTaskFormProps) => {
  const initialStart = initial?.startAt?.toDate?.() ?? null;

  const [locationMode, setLocationMode] = useState<LocationMode>(
    initial?.objectId ? 'object' : initial?.customLocation ? 'custom' : 'object'
  );
  const [objectId, setObjectId] = useState(initial?.objectId ?? '');
  const [customLocation, setCustomLocation] = useState(initial?.customLocation ?? '');
  const [workerId, setWorkerId] = useState(initial?.workerId ?? '');
  const [date, setDate] = useState(initialStart ? toIso(initialStart) : todayIso());
  const [time, setTime] = useState(initialStart ? toTime(initialStart) : '07:00');
  const [description, setDescription] = useState(initial?.description ?? '');

  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [workers, setWorkers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [objectPickerOpen, setObjectPickerOpen] = useState(false);
  const [workerPickerOpen, setWorkerPickerOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToObjects((data) => setObjects(data.filter((o) => !o.archived)));
    return unsub;
  }, []);

  useEffect(() => {
    getAllUsers().then((users) =>
      setWorkers(
        users
          .filter((u) => u.role === ROLE.WORKER && !u.disabled)
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }, []);

  const selectedObjTitle = objectId
    ? objects.find((o) => o.id === objectId)?.title ?? objectId
    : 'Objekt wählen';

  const selectedWorkerName = workerId
    ? workers.find((w) => w.uid === workerId)?.name ?? workerId
    : 'Mitarbeiter wählen';

  const isValid =
    !!workerId &&
    !!date &&
    !!description.trim() &&
    (locationMode === 'object' ? !!objectId : !!customLocation.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValid) {
      setError('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    const [y, mo, d] = date.split('-').map(Number);
    const [h, mi] = time.split(':').map(Number);
    const startAt = Timestamp.fromDate(new Date(y, mo - 1, d, h, mi));

    const payload: Partial<Task> = {
      objectId: locationMode === 'object' ? objectId : null,
      ...(locationMode === 'custom' ? { customLocation: customLocation.trim() } : {}),
      workerId,
      startAt,
      description: description.trim(),
      ...(initial?.id ? {} : { status: TASK_STATUS.NEW }),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      setError(`Fehler: ${msg || 'Bitte erneut versuchen.'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    locationMode, setLocationMode,
    objectId, setObjectId,
    customLocation, setCustomLocation,
    workerId, setWorkerId,
    date, setDate,
    time, setTime,
    description, setDescription,
    objects,
    workers,
    loading,
    error,
    datePickerOpen, setDatePickerOpen,
    timePickerOpen, setTimePickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    workerPickerOpen, setWorkerPickerOpen,
    selectedObjTitle,
    selectedWorkerName,
    isValid,
    handleSubmit,
  };
};
