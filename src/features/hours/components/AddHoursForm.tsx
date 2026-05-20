import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { addHourEntry } from '@shared/services/hoursService';
import { subscribeToObjects } from '@shared/services/objectsService';
import { FiAlertTriangle, FiWifi } from 'react-icons/fi';
import { useAuth } from '@shared/hooks/useAuth';
import { useToast } from '@shared/ui/Toast';
import type { CRMObject } from '@shared/types';

const Form = styled.form`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const BreakGroup = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 3px;
`;

const BreakBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 7px 4px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textSecondary)};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textPrimary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.06)'};
  }
`;

const TotalDisplay = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  text-align: center;
  letter-spacing: 0.04em;
`;

const ErrorBox = styled.div`
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OfflineBanner = styled.div`
  padding: 10px 14px;
  background: rgba(255, 180, 0, 0.08);
  border: 1px solid rgba(255, 180, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 12px;
  font-weight: 600;
  color: #f0a800;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
`;

const BREAKS = [0, 10, 15, 30, 60];

const QUEUE_KEY = 'pendingHoursQueue';

type QueuedEntry = Omit<Parameters<typeof addHourEntry>[0], never>;

const loadQueue = (): QueuedEntry[] => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]'); }
  catch { return []; }
};
const saveQueue = (q: QueuedEntry[]) => localStorage.setItem(QUEUE_KEY, JSON.stringify(q));

const calcMinutes = (start: string, end: string, brk: number): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm) - brk);
};

const formatMinutes = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')} h`;
};

interface Props {
  onAdded?: () => void;
}

export const AddHoursForm: React.FC<Props> = ({ onAdded }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('16:00');
  const [breakMins, setBreakMins] = useState(30);
  const [objectId, setObjectId] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { user, uid } = useAuth();
  const toast = useToast();

  const totalMins = calcMinutes(startTime, endTime, breakMins);

  useEffect(() => {
    const unsub = subscribeToObjects((data) => setObjects(data));
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
    setEndTime('16:00');
    setBreakMins(30);
    setObjectId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!uid) {
      setError('Fehler: Benutzer nicht angemeldet. Bitte neu einloggen.');
      return;
    }

    const selectedObj = objects.find((o) => o.id === objectId);
    const entry: QueuedEntry = {
      userId: uid,
      userName: user?.name ?? uid,
      objectId: objectId || undefined,
      objectTitle: selectedObj?.title ?? undefined,
      date,
      startTime,
      endTime,
      breakMinutes: breakMins,
    };

    if (!navigator.onLine) {
      const q = loadQueue();
      saveQueue([...q, entry]);
      toast.success('Kein Internet – Eintrag wurde gespeichert und wird automatisch übertragen, sobald du wieder online bist');
      resetForm();
      onAdded?.();
      return;
    }

    setLoading(true);
    try {
      await addHourEntry(entry);
      toast.success('Stunden eingetragen');
      resetForm();
      onAdded?.();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('offline') || msg.includes('network') || msg.includes('unavailable')) {
        const q = loadQueue();
        saveQueue([...q, entry]);
        toast.success('Kein Internet – Eintrag wurde gespeichert und wird automatisch übertragen');
        resetForm();
        onAdded?.();
      } else {
        setError(`Fehler: ${msg || 'Bitte erneut versuchen.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = loadQueue().length;

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorBox><FiAlertTriangle size={14} />{error}</ErrorBox>}
      {!uid && (
        <ErrorBox><FiAlertTriangle size={14} />Kein Benutzer geladen. Bitte neu einloggen.</ErrorBox>
      )}
      {!isOnline && (
        <OfflineBanner>
          <FiWifi size={14} />
          Kein Internet – Einträge werden gespeichert und automatisch übertragen.
        </OfflineBanner>
      )}
      {isOnline && pendingCount > 0 && (
        <OfflineBanner>
          <FiWifi size={14} />
          {pendingCount} gespeicherte{pendingCount > 1 ? ' Einträge werden' : 'r Eintrag wird'} gerade übertragen…
        </OfflineBanner>
      )}

      <FormGroup>
        <Label>Datum</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </FormGroup>

      <Row>
        <FormGroup>
          <Label>Beginn</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Ende</Label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </FormGroup>
      </Row>

      <FormGroup>
        <Label>Pause</Label>
        <BreakGroup>
          {BREAKS.map((b) => (
            <BreakBtn key={b} type="button" $active={breakMins === b} onClick={() => setBreakMins(b)}>
              {b === 0 ? 'Keine' : `${b} min`}
            </BreakBtn>
          ))}
        </BreakGroup>
      </FormGroup>

      <FormGroup>
        <Label>Objekt (optional)</Label>
        <Select value={objectId} onChange={(e) => setObjectId(e.target.value)}>
          <option value="">— Kein Objekt —</option>
          {objects.map((o) => (
            <option key={o.id} value={o.id}>{o.title}</option>
          ))}
        </Select>
      </FormGroup>

      <Row>
        <FormGroup>
          <Label>Gesamt</Label>
          <TotalDisplay>{totalMins > 0 ? formatMinutes(totalMins) : '—'}</TotalDisplay>
        </FormGroup>
        <FormGroup style={{ justifyContent: 'flex-end' }}>
          <Label>&nbsp;</Label>
          <Button type="submit" disabled={loading || totalMins <= 0}>
            {loading ? 'Speichern…' : 'Stunden eintragen'}
          </Button>
        </FormGroup>
      </Row>
    </Form>
  );
};
