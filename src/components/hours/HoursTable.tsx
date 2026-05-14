import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiX, FiEdit2 } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input, Select, FormGroup, Label } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { useConfirm } from '../ui/ConfirmDialog';
import { deleteHourEntry, updateHourEntry } from '../../services/hoursService';
import { subscribeToObjects } from '../../services/objectsService';
import { useAuth } from '../../hooks/useAuth';
import type { WorkHourEntry, CRMObject } from '../../types';

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 11px 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
  line-height: 1.4;
  &:last-child { text-align: right; }
`;

const Tr = styled.tr`
  transition: background ${({ theme }) => theme.transitions.fast};
  &:last-child td { border-bottom: none; }
  &:hover td { background: ${({ theme }) => theme.colors.bgElevated}; }
`;

const TotalRow = styled.tr`
  td {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bgCard};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    border-bottom: none;
  }
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const ActionCell = styled.td`
  padding: 6px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: right;
  white-space: nowrap;
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


const EditStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FooterTotal = styled.div`
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.04em;
  white-space: nowrap;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const FooterBtns = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 480px) {
    button { flex: 1; }
  }
`;

const EDIT_BREAKS = [0, 10, 15, 30, 60];

const calcMins = (start: string, end: string, brk: number): number => {
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
  entries: WorkHourEntry[];
  showWorker?: boolean;
  onDelete?: () => void;
}

export const HoursTable: React.FC<Props> = ({ entries, showWorker = false, onDelete }) => {
  const { isAdmin, uid } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const [editEntry, setEditEntry] = useState<WorkHourEntry | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editBreak, setEditBreak] = useState(0);
  const [editObjectId, setEditObjectId] = useState('');
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeToObjects((data) => setObjects(data));
    return unsub;
  }, []);

  const openEdit = (entry: WorkHourEntry) => {
    setEditEntry(entry);
    setEditDate(entry.date);
    setEditStart(entry.startTime);
    setEditEnd(entry.endTime);
    setEditBreak(entry.breakMinutes);
    setEditObjectId(entry.objectId ?? '');
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
        objectTitle: selectedObj?.title,
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

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const editTotal = calcMins(editStart, editEnd, editBreak);

  if (entries.length === 0) {
    return (
      <TableWrapper>
        <Empty>Keine Einträge für diesen Zeitraum.</Empty>
      </TableWrapper>
    );
  }

  return (
    <>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Datum</Th>
              {showWorker && <Th>Mitarbeiter</Th>}
              <Th>Objekt</Th>
              <Th>Beginn</Th>
              <Th>Ende</Th>
              <Th>Pause</Th>
              <Th>Gesamt</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const dateFormatted = format(new Date(e.date), 'dd.MM.yyyy', { locale: de });
              const canEdit = isAdmin || e.userId === uid;
              return (
                <Tr key={e.id}>
                  <Td>{dateFormatted}</Td>
                  {showWorker && <Td style={{ color: '#8a8a8a' }}>{e.userName}</Td>}
                  <Td style={{ color: '#8a8a8a' }}>{e.objectTitle || '—'}</Td>
                  <Td>{e.startTime}</Td>
                  <Td>{e.endTime}</Td>
                  <Td style={{ color: '#8a8a8a' }}>{e.breakMinutes > 0 ? `${e.breakMinutes} min` : '—'}</Td>
                  <Td style={{ fontWeight: 600 }}>{formatMinutes(e.totalMinutes)}</Td>
                  <ActionCell>
                    {canEdit && (
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          $variant="ghost"
                          $size="sm"
                          onClick={() => openEdit(e)}
                          style={{ color: '#777' }}
                          title="Bearbeiten"
                        >
                          <FiEdit2 size={13} />
                        </Button>
                        <Button
                          $variant="ghost"
                          $size="sm"
                          onClick={() => handleDelete(e.id, dateFormatted)}
                          style={{ color: '#777' }}
                          title="Löschen"
                        >
                          <FiX size={14} />
                        </Button>
                      </div>
                    )}
                  </ActionCell>
                </Tr>
              );
            })}
            <TotalRow>
              <Td colSpan={showWorker ? 6 : 5}>Gesamt</Td>
              <Td>{formatMinutes(totalMins)}</Td>
              <Td></Td>
            </TotalRow>
          </tbody>
        </Table>
      </TableWrapper>

      <Modal
        isOpen={!!editEntry}
        onClose={() => setEditEntry(null)}
        title="Stunden bearbeiten"
        width="460px"
      >
        <EditStack>
          {/* Datum — full width */}
          <FormGroup>
            <Label>Datum</Label>
            <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
          </FormGroup>

          {/* Beginn + Ende — side by side, always 2 columns */}
          <TwoCol>
            <FormGroup>
              <Label>Beginn</Label>
              <Input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label>Ende</Label>
              <Input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} required />
            </FormGroup>
          </TwoCol>

          {/* Pause — full width */}
          <FormGroup>
            <Label>Pause</Label>
            <BreakGroup>
              {EDIT_BREAKS.map((b) => (
                <BreakBtn key={b} type="button" $active={editBreak === b} onClick={() => setEditBreak(b)}>
                  {b === 0 ? 'Keine' : `${b} min`}
                </BreakBtn>
              ))}
            </BreakGroup>
          </FormGroup>

          {/* Objekt — full width */}
          <FormGroup>
            <Label>Objekt (optional)</Label>
            <Select value={editObjectId} onChange={(e) => setEditObjectId(e.target.value)}>
              <option value="">— Kein Objekt —</option>
              {objects.map((o) => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </Select>
          </FormGroup>

          {/* Footer: total + action buttons */}
          <ModalFooter>
            <FooterTotal>{editTotal > 0 ? formatMinutes(editTotal) : '—'}</FooterTotal>
            <FooterBtns>
              <Button $variant="secondary" onClick={() => setEditEntry(null)}>Abbrechen</Button>
              <Button onClick={handleSave} disabled={saving || editTotal <= 0}>
                {saving ? 'Speichern…' : 'Speichern'}
              </Button>
            </FooterBtns>
          </ModalFooter>
        </EditStack>
      </Modal>
    </>
  );
};
