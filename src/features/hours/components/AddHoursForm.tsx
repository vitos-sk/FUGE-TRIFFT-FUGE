import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { addHourEntry } from '@shared/services/hoursService';
import { subscribeToObjects } from '@shared/services/objectsService';
import { getAllUsers } from '@shared/services/authService';
import { FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '@shared/hooks/useAuth';
import { useToast } from '@shared/ui/Toast';
import type { CRMObject, AppUser } from '@shared/types';

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
`;

const BREAKS = [0, 10, 15, 30, 60];

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
  const [workers, setWorkers] = useState<AppUser[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, uid, isAdmin } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const unsub = subscribeToObjects((data) => {
      setObjects(data.filter((o) => o.status !== 'done'));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    getAllUsers().then((all) => {
      setWorkers(all.filter((u) => !u.disabled));
    });
  }, [isAdmin]);

  const totalMins = calcMinutes(startTime, endTime, breakMins);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!uid) {
      setError('Fehler: Benutzer nicht angemeldet (uid fehlt).');
      return;
    }

    setLoading(true);
    try {
      const selectedObj = objects.find((o) => o.id === objectId);

      let targetId = uid;
      let targetName = user?.name ?? uid;

      if (isAdmin && selectedWorkerId && selectedWorkerId !== uid) {
        const w = workers.find((u) => u.uid === selectedWorkerId);
        if (w) { targetId = w.uid; targetName = w.name; }
      }

      await addHourEntry({
        userId: targetId,
        userName: targetName,
        objectId: objectId || undefined,
        objectTitle: selectedObj?.title ?? undefined,
        date,
        startTime,
        endTime,
        breakMinutes: breakMins,
      });

      setDate(today);
      setStartTime('07:00');
      setEndTime('16:00');
      setBreakMins(30);
      setObjectId('');
      setSelectedWorkerId('');
      toast.success('Stunden eingetragen');
      onAdded?.();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? 'Unbekannter Fehler';
      setError(`Fehler: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}
      {!uid && (
        <ErrorBox style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiAlertTriangle size={14} /> Kein Benutzer geladen. Bitte neu einloggen.</ErrorBox>
      )}
      {isAdmin && (
        <FormGroup>
          <Label>Mitarbeiter</Label>
          <Select value={selectedWorkerId} onChange={(e) => setSelectedWorkerId(e.target.value)}>
            <option value="">— Für mich selbst ({user?.name}) —</option>
            {workers
              .filter((w) => w.uid !== uid)
              .map((w) => (
                <option key={w.uid} value={w.uid}>{w.name}</option>
              ))}
          </Select>
        </FormGroup>
      )}

      <Row>
        <FormGroup>
          <Label>Datum</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Beginn</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </FormGroup>
        <FormGroup>
          <Label>Ende</Label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </FormGroup>
      </Row>

      <Row>
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
      </Row>

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
