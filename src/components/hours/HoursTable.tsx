import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiX } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useConfirm } from '../ui/ConfirmDialog';
import { deleteHourEntry } from '../../services/hoursService';
import { useAuth } from '../../hooks/useAuth';
import type { WorkHourEntry } from '../../types';

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

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

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

  if (entries.length === 0) {
    return (
      <TableWrapper>
        <Empty>Keine Einträge für diesen Zeitraum.</Empty>
      </TableWrapper>
    );
  }

  return (
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
            return (
              <Tr key={e.id}>
                <Td>{dateFormatted}</Td>
                {showWorker && <Td style={{ color: '#8a8a8a' }}>{e.userName}</Td>}
                <Td style={{ color: '#8a8a8a' }}>{e.objectTitle || '—'}</Td>
                <Td>{e.startTime}</Td>
                <Td>{e.endTime}</Td>
                <Td style={{ color: '#8a8a8a' }}>{e.breakMinutes > 0 ? `${e.breakMinutes} min` : '—'}</Td>
                <Td style={{ fontWeight: 600 }}>{formatMinutes(e.totalMinutes)}</Td>
                <Td>
                  {(isAdmin || e.userId === uid) && (
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => handleDelete(e.id, dateFormatted)}
                      style={{ color: '#777' }}
                    >
                      <FiX size={14} />
                    </Button>
                  )}
                </Td>
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
  );
};
