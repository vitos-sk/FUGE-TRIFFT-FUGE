import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiX, FiEdit2 } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { DateInput } from '@shared/ui/DateInput';
import { TimeInput } from '@shared/ui/TimeInput';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
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
  HideMobileTd,
  EditStack,
  TwoCol,
  ModalFooter,
  FooterTotal,
  FooterBtns,
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

  const [editEntry, setEditEntry] = useState<WorkHourEntry | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editBreak, setEditBreak] = useState(0);
  const [editObjectId, setEditObjectId] = useState('');
  const [editLocationText, setEditLocationText] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [saving, setSaving] = useState(false);

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
        <TableWrapper>
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
                const dateFormatted = format(new Date(e.date), 'dd.MM.yyyy', { locale: de });
                const isOwn = e.userId === uid;
                return (
                  <Tr key={e.id}>
                    <Td>{dateFormatted}</Td>
                    {showWorker && <Td style={{ color: '#666' }}>{e.userName}</Td>}
                    <Td style={{ color: '#666' }}>{e.objectTitle || '—'}</Td>
                    <Td>{e.startTime}</Td>
                    <Td>{e.endTime}</Td>
                    <HideMobileTd style={{ color: '#666' }}>
                      {e.breakMinutes > 0 ? `${e.breakMinutes} min` : '—'}
                    </HideMobileTd>
                    <Td style={{ fontWeight: 700 }}>{formatMinutes(e.totalMinutes)}</Td>
                    <ActionCell>
                      {isOwn && (
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button $variant="ghost" $size="sm" onClick={() => openEdit(e)}
                            style={{ color: '#555' }} title="Bearbeiten">
                            <FiEdit2 size={13} />
                          </Button>
                          <Button $variant="ghost" $size="sm"
                            onClick={() => handleDelete(e.id, dateFormatted)}
                            style={{ color: '#555' }} title="Löschen">
                            <FiX size={14} />
                          </Button>
                        </div>
                      )}
                    </ActionCell>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      </Outer>

      <Modal isOpen={!!editEntry} onClose={() => setEditEntry(null)} title="Stunden bearbeiten" width="460px">
        <EditStack>
          <DateInput label="Datum" value={editDate} onChange={setEditDate} required />

          <TwoCol>
            <TimeInput label="Beginn" value={editStart} onChange={setEditStart} required />
            <TimeInput label="Ende" value={editEnd} onChange={setEditEnd} required />
          </TwoCol>

          <FormGroup>
            <Label>Pause</Label>
            <SegmentedControl
              options={EDIT_BREAK_OPTIONS}
              value={editBreak}
              onChange={(v) => setEditBreak(v as number)}
            />
          </FormGroup>

          <FormGroup>
            <Label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              Objekt
              {!editObjectId && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#cc2222', boxShadow: '0 0 6px #cc222299', display: 'inline-block', flexShrink: 0 }} />}
            </Label>
            <Select value={editObjectId} onChange={(e) => setEditObjectId(e.target.value)}>
              <option value="">⚠ kein Objekt</option>
              {objects.map((o) => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </Select>
          </FormGroup>

          {!editObjectId && (
            <FormGroup>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <Label style={{ margin: 0 }}>Wo gearbeitet?</Label>
                <span style={{ fontSize: 11, color: editLocationText.length >= 13 ? '#cc2222' : '#555', fontVariantNumeric: 'tabular-nums' }}>
                  {editLocationText.length} / 15
                </span>
              </div>
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
    </>
  );
};
