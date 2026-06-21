import React, { useState, useEffect, useCallback } from 'react';
import { FormGroup, Label, Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { Modal } from '@shared/ui/Modal';
import { addHourEntry } from '@shared/services/hoursService';
import { subscribeToObjects } from '@shared/services/objectsService';
import { FiAlertTriangle, FiWifi, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { useAuth } from '@shared/hooks/useAuth';
import { useToast } from '@shared/ui/Toast';
import type { CRMObject } from '@shared/types';
import { FieldBtn } from './FieldBtn';
import { TimePickerSheet } from './TimePickerSheet';
import { DatePickerSheet } from './DatePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import {
  Form,
  Row,
  TopRow,
  ObjektRow,
  ObjektSelectWrap,
  ObjektRowActions,
  TotalDisplay,
  ErrorBox,
  OfflineBannerDiv,
  LabelWithIndicator,
  RequiredDot,
  ModalFooter,
  CharCountRow,
  CharCount,
  ModalFormGroupLast,
} from './AddHoursForm.styles';

const BREAKS = [0, 10, 15, 30, 60];
const BREAK_OPTIONS = BREAKS.map((b) => ({ value: b, label: b === 0 ? 'Keine' : `${b} min` }));

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
  if (endMins <= startMins) endMins += 24 * 60;
  return Math.max(0, endMins - startMins - brk);
};

const formatMinutes = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')} h`;
};

const formatDateDisplay = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
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

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [endPickerOpen, setEndPickerOpen] = useState(false);
  const [objectPickerOpen, setObjectPickerOpen] = useState(false);
  const [modalObjectPickerOpen, setModalObjectPickerOpen] = useState(false);

  const { user, uid } = useAuth();
  const toast = useToast();

  const totalMins = calcMinutes(startTime, endTime, breakMins);
  const selectedObjTitle = objectId
    ? (objects.find((o) => o.id === objectId)?.title ?? objectId)
    : '⚠ kein Objekt';
  const modalObjTitle = modalObjectId
    ? (objects.find((o) => o.id === modalObjectId)?.title ?? modalObjectId)
    : '';

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
          <OfflineBannerDiv>
            <FiWifi size={14} />
            Kein Internet – Einträge werden gespeichert und automatisch übertragen.
          </OfflineBannerDiv>
        )}
        {isOnline && pendingCount > 0 && (
          <OfflineBannerDiv>
            <FiWifi size={14} />
            {pendingCount} gespeicherte{pendingCount > 1 ? ' Einträge werden' : 'r Eintrag wird'} gerade übertragen…
          </OfflineBannerDiv>
        )}

        <TopRow>
          <FieldBtn
            label="Datum"
            value={formatDateDisplay(date)}
            icon={<FiCalendar size={14} />}
            onClick={() => setDatePickerOpen(true)}
          />
          <Row>
            <FieldBtn
              label="Beginn"
              value={startTime}
              icon={<FiClock size={14} />}
              onClick={() => setStartPickerOpen(true)}
            />
            <FieldBtn
              label="Ende"
              value={endTime}
              icon={<FiClock size={14} />}
              onClick={() => setEndPickerOpen(true)}
            />
          </Row>
        </TopRow>

        <FormGroup>
          <Label>Pause</Label>
          <SegmentedControl
            options={BREAK_OPTIONS}
            value={breakMins}
            onChange={(v) => setBreakMins(v as number)}
          />
        </FormGroup>

        <ObjektRow>
          <ObjektSelectWrap>
            <FieldBtn
              label={<LabelWithIndicator>Objekt{!objectId && <RequiredDot />}</LabelWithIndicator>}
              value={selectedObjTitle}
              icon={<FiMapPin size={14} />}
              onClick={() => setObjectPickerOpen(true)}
            />
          </ObjektSelectWrap>

          <ObjektRowActions>
            <TotalDisplay>{totalMins > 0 ? formatMinutes(totalMins) : '—'}</TotalDisplay>
            <SubmitButton loading={loading} disabled={totalMins <= 0}>
              <HiPlus size={20} />
            </SubmitButton>
          </ObjektRowActions>
        </ObjektRow>
      </Form>

      <DatePickerSheet
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        value={date}
        onChange={setDate}
      />
      <TimePickerSheet
        isOpen={startPickerOpen}
        onClose={() => setStartPickerOpen(false)}
        title="Beginn"
        value={startTime}
        onChange={setStartTime}
      />
      <TimePickerSheet
        isOpen={endPickerOpen}
        onClose={() => setEndPickerOpen(false)}
        title="Ende"
        value={endTime}
        onChange={setEndTime}
      />
      <ObjectPickerSheet
        isOpen={objectPickerOpen}
        onClose={() => setObjectPickerOpen(false)}
        value={objectId}
        onChange={setObjectId}
        objects={objects}
      />
      <ObjectPickerSheet
        isOpen={modalObjectPickerOpen}
        onClose={() => setModalObjectPickerOpen(false)}
        value={modalObjectId}
        onChange={(v) => { setModalObjectId(v); setLocationNote(''); }}
        objects={objects}
      />

      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Wo hast du gearbeitet?"
        alignTop
        footer={
          <ModalFooter>
            <Button $variant="secondary" type="button" onClick={() => setShowLocationModal(false)}>
              Abbrechen
            </Button>
            <SubmitButton
              type="button"
              loading={loading}
              loadingText="Speichern…"
              disabled={!modalObjectId && !locationNote.trim()}
              onClick={handleLocationConfirm}
            >
              Eintragen
            </SubmitButton>
          </ModalFooter>
        }
      >
        <FieldBtn
          label={
            <LabelWithIndicator>
              Objekt auswählen{!modalObjectId && <RequiredDot />}
            </LabelWithIndicator>
          }
          value={modalObjTitle}
          icon={<FiMapPin size={14} />}
          onClick={() => setModalObjectPickerOpen(true)}
        />

        {!modalObjectId && (
          <ModalFormGroupLast>
            <CharCountRow>
              <Label>Kurzbeschreibung *</Label>
              <CharCount $warn={locationNote.length >= 13}>
                {locationNote.length} / 15
              </CharCount>
            </CharCountRow>
            <Input
              type="text"
              value={locationNote}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationNote(e.target.value)}
              placeholder="z.B. Baustelle FB…"
              maxLength={15}
              autoFocus
            />
          </ModalFormGroupLast>
        )}
      </Modal>
    </>
  );
};
