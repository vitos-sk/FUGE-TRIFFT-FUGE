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
  padding: 9px 28px;
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

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ─── Filter bar ────────────────────────────────────────────────────────────────

const FilterBar = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const PeriodGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 3px;

  @media (max-width: 340px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PeriodBtn = styled.button<{ $active: boolean }>`
  padding: 9px 4px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.textSecondary)};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;
  text-align: center;

  &:hover:not([disabled]) {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textPrimary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.06)'};
  }
`;

const CustomDateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const TotalBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TotalChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(204, 34, 34, 0.08);
  border: 1px solid rgba(204, 34, 34, 0.22);
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

const ExportRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalH = Math.floor(totalMins / 60);
  const totalM = totalMins % 60;

  return (
    <>
      <PageTitle>Arbeitsstunden</PageTitle>

      <TabBar>
        {isAdmin ? (
          <>
            <Tab $active={tab === 'view'} onClick={() => setTab('view')}>Übersicht</Tab>
            <Tab $active={tab === 'add'} onClick={() => setTab('add')}>Eintragen</Tab>
          </>
        ) : (
          <>
            <Tab $active={tab === 'add'} onClick={() => setTab('add')}>Eintragen</Tab>
            <Tab $active={tab === 'view'} onClick={() => setTab('view')}>Übersicht</Tab>
          </>
        )}
      </TabBar>

      {tab === 'add' && (
        <>
          <SectionTitle>Stunden eintragen</SectionTitle>
          <AddHoursForm onAdded={() => { load(); setTab('view'); }} />
        </>
      )}

      {tab === 'view' && (
        <>
          <FilterBar>
            {isAdmin && (
              <FormGroup style={{ margin: 0 }}>
                <Label>Mitarbeiter</Label>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Alle Mitarbeiter</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>{u.name}</option>
                  ))}
                </Select>
              </FormGroup>
            )}

            <div>
              <Label style={{ marginBottom: 6 }}>Zeitraum</Label>
              <PeriodGroup>
                <PeriodBtn $active={range === 'week'} onClick={() => setRange('week')}>Diese Woche</PeriodBtn>
                <PeriodBtn $active={range === 'month'} onClick={() => setRange('month')}>Dieser Monat</PeriodBtn>
                <PeriodBtn $active={range === 'all'} onClick={() => setRange('all')}>Alle</PeriodBtn>
                <PeriodBtn $active={range === 'custom'} onClick={() => setRange('custom')}>Eigener</PeriodBtn>
              </PeriodGroup>
            </div>

            {range === 'custom' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <CustomDateRow>
                  <FormGroup style={{ margin: 0 }}>
                    <Label>Von</Label>
                    <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                  </FormGroup>
                  <FormGroup style={{ margin: 0 }}>
                    <Label>Bis</Label>
                    <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                  </FormGroup>
                </CustomDateRow>
                <Button onClick={load} $variant="secondary" style={{ width: '100%' }}>
                  Laden
                </Button>
              </div>
            )}

            {isAdmin && (
              <ExportRow>
                <FormGroup style={{ margin: 0 }}>
                  <Label>Excel-Export (Monat)</Label>
                  <Input
                    type="month"
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    style={{ minWidth: 150 }}
                  />
                </FormGroup>
                <Button $variant="secondary" onClick={exportToExcel}>
                  Exportieren
                </Button>
              </ExportRow>
            )}
          </FilterBar>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Spinner />
            </div>
          ) : (
            <>
              {!loading && entries.length > 0 && (
                <TotalBar>
                  <div />
                  <TotalChip>
                    Gesamt <TotalValue>{totalH}:{String(totalM).padStart(2, '0')} h</TotalValue>
                  </TotalChip>
                </TotalBar>
              )}
              <HoursTable entries={entries} showWorker={isAdmin && !selectedUser} onDelete={load} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default HoursPage;
