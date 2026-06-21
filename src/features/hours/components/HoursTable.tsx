import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiX, FiEdit2, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
import { FieldBtn } from './FieldBtn';
import { DatePickerSheet } from './DatePickerSheet';
import { TimePickerSheet } from './TimePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { Modal } from '@shared/ui/Modal';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { deleteHourEntry, updateHourEntry } from '@shared/services/hoursService';
import { subscribeToObjects } from '@shared/services/objectsService';
import { useAuth } from '@shared/hooks/useAuth';
import type { WorkHourEntry, CRMObject } from '@shared/types';
import {
  Outer,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  ActionCell,
  Empty,
  HideMobile,
  EditStack,
  TwoCol,
  ModalFooter,
  FooterTotal,
  FooterBtns,
  ScrollTrack,
  ScrollThumb,
  DimTd,
  DimHideMobileTd,
  BoldTd,
  ActionBtnsDiv,
  LabelWithIndicator,
  RequiredDot,
  CharCountRow,
  CharCount,
} from './HoursTable.styles';

// ─── Helpers ────────────────────────────────────────────────────────────────────

const EDIT_BREAKS = [0, 10, 15, 30, 60];
const EDIT_BREAK_OPTIONS = EDIT_BREAKS.map((b) => ({ value: b, label: b === 0 ? 'Keine' : `${b} min` }));

const calcMins = (start: string, end: string, brk: number): number => {
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

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  entries: WorkHourEntry[];
  showWorker?: boolean;
  onDelete?: () => void;
}

export const HoursTable: React.FC<Props> = ({ entries, showWorker = false, onDelete }) => {
  const { uid } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  // ── Кастомный скроллбар ──────────────────────────────────────────────────
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbState, setThumbState] = useState({ left: 0, width: 100 });
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateThumb = useCallback(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    const ratio = el.clientWidth / el.scrollWidth;
    const overflows = ratio < 0.999;
    setHasOverflow(overflows);
    if (!overflows) return;
    const thumbW = Math.max(ratio * 100, 8);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollRatio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setThumbState({ left: scrollRatio * (100 - thumbW), width: thumbW });
  }, []);

  useEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateThumb, { passive: true });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    updateThumb();
    return () => { el.removeEventListener('scroll', updateThumb); ro.disconnect(); };
  }, [updateThumb]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const el = tableWrapperRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = tableWrapperRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    const trackW = thumb.parentElement!.clientWidth;
    const thumbW = thumb.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    thumb.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      el.scrollLeft = startScroll + (dx / (trackW - thumbW)) * maxScroll;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };
  // ────────────────────────────────────────────────────────────────────────

  const [editEntry, setEditEntry] = useState<WorkHourEntry | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editBreak, setEditBreak] = useState(0);
  const [editObjectId, setEditObjectId] = useState('');
  const [editLocationText, setEditLocationText] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [saving, setSaving] = useState(false);
  const [editDatePickerOpen, setEditDatePickerOpen] = useState(false);
  const [editStartPickerOpen, setEditStartPickerOpen] = useState(false);
  const [editEndPickerOpen, setEditEndPickerOpen] = useState(false);
  const [editObjectPickerOpen, setEditObjectPickerOpen] = useState(false);

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

  const openEdit = (entry: WorkHourEntry) => {
    setEditEntry(entry);
    setEditDate(entry.date);
    setEditStart(entry.startTime);
    setEditEnd(entry.endTime);
    setEditBreak(entry.breakMinutes);
    setEditObjectId(entry.objectId ?? '');
    setEditLocationText(!entry.objectId && entry.objectTitle ? entry.objectTitle : '');
  };

  const handleSave = async () => {
    if (!editEntry) return;
    const totalMinutes = calcMins(editStart, editEnd, editBreak);
    if (totalMinutes <= 0) return;
    setSaving(true);
    try {
      const selectedObj = objects.find((o) => o.id === editObjectId);
      await updateHourEntry(editEntry.id, {
        date: editDate,
        startTime: editStart,
        endTime: editEnd,
        breakMinutes: editBreak,
        totalMinutes,
        objectId: editObjectId || null,
        objectTitle: editObjectId
          ? selectedObj?.title
          : editLocationText.trim() || undefined,
      });
      toast.success('Stunden aktualisiert');
      setEditEntry(null);
      onDelete?.();
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, date: string) => {
    const ok = await confirm({
      title: 'Eintrag löschen',
      message: `Stundeneintrag vom ${date} wirklich löschen?`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteHourEntry(id);
      toast.success('Eintrag gelöscht');
      onDelete?.();
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const editTotal = calcMins(editStart, editEnd, editBreak);
  const editObjTitle = editObjectId
    ? (objects.find((o) => o.id === editObjectId)?.title ?? editObjectId)
    : '⚠ kein Objekt';

  if (entries.length === 0) {
    return (
      <Outer>
        <Empty>Keine Einträge für diesen Zeitraum.</Empty>
      </Outer>
    );
  }


  return (
    <>
      <Outer>
        <TableWrapper ref={tableWrapperRef}>
          <Table>
            <thead>
              <tr>
                <Th>Datum</Th>
                {showWorker && <Th>Mitarbeiter</Th>}
                <Th>Objekt</Th>
                <Th>Beginn</Th>
                <Th>Ende</Th>
                <HideMobile>Pause</HideMobile>
                <Th>Gesamt</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const dateFormatted = format(new Date(e.date + 'T12:00:00'), 'dd.MM.yyyy', { locale: de });
                const isOwn = e.userId === uid;
                return (
                  <Tr key={e.id}>
                    <Td>{dateFormatted}</Td>
                    {showWorker && <DimTd>{e.userName}</DimTd>}
                    <DimTd>{e.objectTitle || '—'}</DimTd>
                    <Td>{e.startTime}</Td>
                    <Td>{e.endTime}</Td>
                    <DimHideMobileTd>
                      {e.breakMinutes > 0 ? `${e.breakMinutes} min` : '—'}
                    </DimHideMobileTd>
                    <BoldTd>{formatMinutes(e.totalMinutes)}</BoldTd>
                    <ActionCell>
                      {isOwn && (
                        <ActionBtnsDiv>
                          <Button $variant="ghost" $size="sm" onClick={() => openEdit(e)} title="Bearbeiten">
                            <FiEdit2 size={13} />
                          </Button>
                          <Button $variant="ghost" $size="sm"
                            onClick={() => handleDelete(e.id, dateFormatted)} title="Löschen">
                            <FiX size={14} />
                          </Button>
                        </ActionBtnsDiv>
                      )}
                    </ActionCell>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
        {hasOverflow && (
          <ScrollTrack onClick={handleTrackClick}>
            <ScrollThumb
              ref={thumbRef}
              style={{ left: `${thumbState.left}%`, width: `${thumbState.width}%` }}
              onPointerDown={handleThumbPointerDown}
            />
          </ScrollTrack>
        )}
      </Outer>

      <Modal isOpen={!!editEntry} onClose={() => setEditEntry(null)} title="Stunden bearbeiten" width="460px">
        <EditStack>
          <FieldBtn
            label="Datum"
            value={formatDateDisplay(editDate)}
            icon={<FiCalendar size={14} />}
            onClick={() => setEditDatePickerOpen(true)}
          />

          <TwoCol>
            <FieldBtn
              label="Beginn"
              value={editStart}
              icon={<FiClock size={14} />}
              onClick={() => setEditStartPickerOpen(true)}
            />
            <FieldBtn
              label="Ende"
              value={editEnd}
              icon={<FiClock size={14} />}
              onClick={() => setEditEndPickerOpen(true)}
            />
          </TwoCol>

          <FormGroup>
            <Label>Pause</Label>
            <SegmentedControl
              options={EDIT_BREAK_OPTIONS}
              value={editBreak}
              onChange={(v) => setEditBreak(v as number)}
            />
          </FormGroup>

          <FieldBtn
            label={<LabelWithIndicator>Objekt{!editObjectId && <RequiredDot />}</LabelWithIndicator>}
            value={editObjTitle}
            icon={<FiMapPin size={14} />}
            onClick={() => setEditObjectPickerOpen(true)}
          />

          {!editObjectId && (
            <FormGroup>
              <CharCountRow>
                <Label>Wo gearbeitet?</Label>
                <CharCount $warn={editLocationText.length >= 13}>
                  {editLocationText.length} / 15
                </CharCount>
              </CharCountRow>
              <Input
                type="text"
                value={editLocationText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLocationText(e.target.value)}
                placeholder="z.B. Baustelle Freiburg…"
                maxLength={15}
              />
            </FormGroup>
          )}

          <ModalFooter>
            <FooterTotal>{editTotal > 0 ? formatMinutes(editTotal) : '—'}</FooterTotal>
            <FooterBtns>
              <Button $variant="secondary" onClick={() => setEditEntry(null)}>Abbrechen</Button>
              <SubmitButton type="button" loading={saving} loadingText="Speichern…" disabled={editTotal <= 0} onClick={handleSave}>
                Speichern
              </SubmitButton>
            </FooterBtns>
          </ModalFooter>
        </EditStack>
      </Modal>

      <DatePickerSheet
        isOpen={editDatePickerOpen}
        onClose={() => setEditDatePickerOpen(false)}
        value={editDate}
        onChange={setEditDate}
      />
      <TimePickerSheet
        isOpen={editStartPickerOpen}
        onClose={() => setEditStartPickerOpen(false)}
        title="Beginn"
        value={editStart}
        onChange={setEditStart}
      />
      <TimePickerSheet
        isOpen={editEndPickerOpen}
        onClose={() => setEditEndPickerOpen(false)}
        title="Ende"
        value={editEnd}
        onChange={setEditEnd}
      />
      <ObjectPickerSheet
        isOpen={editObjectPickerOpen}
        onClose={() => setEditObjectPickerOpen(false)}
        value={editObjectId}
        onChange={setEditObjectId}
        objects={objects}
      />
    </>
  );
};
