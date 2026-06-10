import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';
import { addHourEntry } from '@shared/services/hoursService';
import { subscribeToObjects } from '@shared/services/objectsService';
import { FiAlertTriangle, FiWifi, FiRefreshCw } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
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

  @media (max-width: 374px) {
    padding: 14px 12px;
    gap: 12px;
  }

  @media (min-width: 640px) {
    max-width: 580px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

/* On desktop: Datum + [Beginn/Ende] side by side */
const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    gap: 12px;

    > *:first-child { flex: 1; }
    > *:last-child  { flex: 2; }
  }
`;

const BreakGroup = styled.div`
  display: flex;
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 3px;

  @media (max-width: 374px) {
    gap: 2px;
    padding: 2px;
  }
`;

const BreakBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 6px 2px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;
  min-width: 0;

  @media (max-width: 374px) {
    padding: 5px 1px;
    font-size: 10px;
  }

  ${({ $active }) => $active ? `
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.9);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  ` : `
    background: transparent;
    color: rgba(255,255,255,0.35);
  `}

  &:hover {
    ${({ $active }: { $active: boolean }) => !$active && `
      color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.05);
    `}
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    justify-content: stretch;
  }
`;

const TotalDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  min-width: 110px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.04em;
  white-space: nowrap;

  @media (max-width: 640px) {
    flex: 1;
    padding: 10px 14px;
  }
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
  let endMins = eh * 60 + em;
  const startMins = sh * 60 + sm;
  // overnight shift: end is on the next day
  if (endMins <= startMins) endMins += 24 * 60;
  return Math.max(0, endMins - startMins - brk);
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
  const [modalObjectId, setModalObjectId] = useState('');
  const { user, uid } = useAuth();
  const toast = useToast();

  const totalMins = calcMinutes(startTime, endTime, breakMins);

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
    setModalObjectId('');
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

    if (objectId) { await saveEntry(entry); return; }

    setPendingEntry(entry);
    setModalObjectId('');
    setLocationNote('');
    setShowLocationModal(true);
  };

  const handleLocationConfirm = async () => {
    if (!pendingEntry) return;
    const modalObj = objects.find((o) => o.id === modalObjectId);
    await saveEntry({
      ...pendingEntry,
      objectId: modalObjectId || undefined,
      objectTitle: modalObjectId ? modalObj?.title : locationNote.trim() || undefined,
    });
    setShowLocationModal(false);
  };

  const pendingCount = loadQueue().length;

  return (
    <>
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

      <TopRow>
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
      </TopRow>

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
        <Label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          Objekt
          {!objectId && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc2222', boxShadow: '0 0 6px #cc222299', display: 'inline-block', flexShrink: 0 }} />}
        </Label>
        <Select value={objectId} onChange={(e) => setObjectId(e.target.value)}>
          <option value="">⚠ kein Objekt</option>
          {objects.map((o) => (
            <option key={o.id} value={o.id}>{o.title}</option>
          ))}
        </Select>
      </FormGroup>

      <BottomRow>
        <TotalDisplay>{totalMins > 0 ? formatMinutes(totalMins) : '—'}</TotalDisplay>
        <Button type="submit" disabled={loading || totalMins <= 0} style={{ padding: '10px 22px' }}>
          {loading ? <FiRefreshCw size={17} /> : <HiPlus size={20} />}
        </Button>
      </BottomRow>
    </Form>

    <Modal
      isOpen={showLocationModal}
      onClose={() => setShowLocationModal(false)}
      title="Wo hast du gearbeitet?"
    >
      <FormGroup style={{ marginBottom: 16 }}>
        <Label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          Objekt auswählen
          {!modalObjectId && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc2222', boxShadow: '0 0 6px #cc222299', display: 'inline-block', flexShrink: 0 }} />}
        </Label>
        <Select value={modalObjectId} onChange={(e) => { setModalObjectId(e.target.value); setLocationNote(''); }}>
          <option value="">⚠ kein Objekt</option>
          {objects.map((o) => (
            <option key={o.id} value={o.id}>{o.title}</option>
          ))}
        </Select>
      </FormGroup>

      {!modalObjectId && (
        <FormGroup style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
            <Label style={{ margin: 0 }}>Kurzbeschreibung *</Label>
            <span style={{ fontSize: 11, color: locationNote.length >= 13 ? '#cc2222' : '#555', fontVariantNumeric: 'tabular-nums' }}>
              {locationNote.length} / 15
            </span>
          </div>
          <Input
            value={locationNote}
            onChange={(e) => setLocationNote(e.target.value)}
            placeholder="z.B. Baustelle FB…"
            maxLength={15}
            autoFocus
          />
        </FormGroup>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button $variant="secondary" type="button" onClick={() => setShowLocationModal(false)}>
          Abbrechen
        </Button>
        <Button
          type="button"
          disabled={loading || (!modalObjectId && !locationNote.trim())}
          onClick={handleLocationConfirm}
        >
          {loading ? 'Speichern…' : 'Eintragen'}
        </Button>
      </div>
    </Modal>
  </>
  );
};
