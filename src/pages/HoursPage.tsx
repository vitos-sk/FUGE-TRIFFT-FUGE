import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AddHoursForm } from '../components/hours/AddHoursForm';
import { HoursTable } from '../components/hours/HoursTable';
import { Button } from '../components/ui/Button';
import { Select, Input, FormGroup, Label } from '../components/ui/Input';
import { getAllHours, getHoursForUser } from '../services/hoursService';
import { getAllUsers } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { WorkHourEntry, AppUser } from '../types';
import { Spinner } from '../components/ui/Spinner';

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 4px;
  margin-bottom: 24px;
  width: fit-content;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 9px 24px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textSecondary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.05)'};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 18px 20px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const RangeButtons = styled.div`
  display: flex;
  gap: 4px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 3px;
`;

const RangeBtn = styled.button<{ $active: boolean }>`
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textSecondary)};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  letter-spacing: 0.02em;

  &:hover:not([disabled]) {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textPrimary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.06)'};
  }
`;

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 14px;
`;

type RangePreset = 'week' | 'month' | 'all' | 'custom';

const exportCSV = (entries: WorkHourEntry[]) => {
  const header = 'Datum,Mitarbeiter,Objekt,Beginn,Ende,Pause (min),Gesamt (h)\n';
  const rows = entries.map((e) => {
    const h = Math.floor(e.totalMinutes / 60);
    const m = e.totalMinutes % 60;
    return [
      e.date,
      e.userName,
      e.objectTitle ?? '',
      e.startTime,
      e.endTime,
      e.breakMinutes,
      `${h}:${String(m).padStart(2, '0')}`,
    ].join(',');
  });
  const blob = new Blob([header + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stunden_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
};

const HoursPage: React.FC = () => {
  const { isAdmin, uid } = useAuth();
  const [tab, setTab] = useState<'add' | 'view'>('add');
  const [entries, setEntries] = useState<WorkHourEntry[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [range, setRange] = useState<RangePreset>('week');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      getAllUsers().then((u) => setUsers(u.filter((x) => x.role === 'worker' || x.role === 'admin')));
    }
  }, [isAdmin]);

  const getDateRange = (): [Date | undefined, Date | undefined] => {
    const now = new Date();
    if (range === 'week') return [startOfWeek(now, { locale: de }), endOfWeek(now, { locale: de })];
    if (range === 'month') return [startOfMonth(now), endOfMonth(now)];
    if (range === 'all') return [undefined, undefined];
    if (customFrom && customTo) return [new Date(customFrom), new Date(customTo)];
    return [startOfWeek(now, { locale: de }), endOfWeek(now, { locale: de })];
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [from, to] = getDateRange();
    try {
      if (isAdmin) {
        const all = await getAllHours(from, to);
        const filtered = selectedUser ? all.filter((e) => e.userId === selectedUser) : all;
        setEntries(filtered);
      } else if (uid) {
        const own = await getHoursForUser(uid, from, to);
        setEntries(own);
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, uid, range, selectedUser, customFrom, customTo]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageTitle>Arbeitsstunden</PageTitle>

      <TabBar>
        <Tab $active={tab === 'add'} onClick={() => setTab('add')}>Eintragen</Tab>
        <Tab $active={tab === 'view'} onClick={() => setTab('view')}>Übersicht</Tab>
      </TabBar>

      {tab === 'add' && (
        <>
          <SectionTitle>Stunden eintragen</SectionTitle>
          <AddHoursForm onAdded={() => { load(); setTab('view'); }} />
        </>
      )}

      {tab === 'view' && (
        <>
          <SectionTitle>Übersicht</SectionTitle>

          <Controls>
            {isAdmin && (
              <FormGroup>
                <Label>Mitarbeiter</Label>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  style={{ minWidth: 180 }}
                >
                  <option value="">Alle</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>{u.name}</option>
                  ))}
                </Select>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Zeitraum</Label>
              <RangeButtons>
                <RangeBtn $active={range === 'week'} onClick={() => setRange('week')}>Diese Woche</RangeBtn>
                <RangeBtn $active={range === 'month'} onClick={() => setRange('month')}>Dieser Monat</RangeBtn>
                <RangeBtn $active={range === 'all'} onClick={() => setRange('all')}>Alle</RangeBtn>
                <RangeBtn $active={range === 'custom'} onClick={() => setRange('custom')}>Benutzerdefiniert</RangeBtn>
              </RangeButtons>
            </FormGroup>

            {range === 'custom' && (
              <>
                <FormGroup>
                  <Label>Von</Label>
                  <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label>Bis</Label>
                  <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label>&nbsp;</Label>
              <Button onClick={load} $variant="secondary">Aktualisieren</Button>
            </FormGroup>

            {isAdmin && (
              <FormGroup>
                <Label>&nbsp;</Label>
                <Button onClick={() => exportCSV(entries)} $variant="secondary">Export CSV</Button>
              </FormGroup>
            )}
          </Controls>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Spinner />
            </div>
          ) : (
            <HoursTable entries={entries} showWorker={isAdmin && !selectedUser} onDelete={load} />
          )}
        </>
      )}
    </>
  );
};

export default HoursPage;
