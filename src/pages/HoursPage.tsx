import React from 'react';
import styled from 'styled-components';
import { AddHoursForm } from '@features/hours/components/AddHoursForm';
import { HoursTable } from '@features/hours/components/HoursTable';
import { Button } from '@shared/ui/Button';
import { Select, Input, FormGroup, Label } from '@shared/ui/Input';
import { Spinner } from '@shared/ui/Spinner';
import { useHoursPage } from '@features/hours/hooks/useHoursPage';

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
`;

const ViewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const TotalChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(204,34,34,0.08);
  border: 1px solid rgba(204,34,34,0.22);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TotalValue = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
  text-transform: none;
`;

const HoursPage: React.FC = () => {
  const {
    isAdmin,
    tab, setTab,
    entries,
    users,
    selectedUser, setSelectedUser,
    range, setRange,
    customFrom, setCustomFrom,
    customTo, setCustomTo,
    loading,
    exportMonth, setExportMonth,
    load,
    exportToExcel,
  } = useHoursPage();

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
          {(() => {
            const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
            const totalH = Math.floor(totalMins / 60);
            const totalM = totalMins % 60;
            return (
              <ViewHeader>
                <SectionTitle>Übersicht</SectionTitle>
                {!loading && entries.length > 0 && (
                  <TotalChip>
                    Gesamt <TotalValue>{totalH}:{String(totalM).padStart(2, '0')} h</TotalValue>
                  </TotalChip>
                )}
              </ViewHeader>
            );
          })()}

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
              <>
                <FormGroup>
                  <Label>Monat für Excel</Label>
                  <Input
                    type="month"
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    style={{ minWidth: 160 }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>&nbsp;</Label>
                  <Button $variant="secondary" onClick={exportToExcel}>
                    Excel-Export
                  </>
                </FormGroup>
              </>
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
