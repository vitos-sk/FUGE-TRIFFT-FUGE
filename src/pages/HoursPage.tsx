import React from 'react';
import { FiDownload } from 'react-icons/fi';
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

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const TabBar = styled.div`
  display: flex;
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 4px;
  width: fit-content;
  flex-shrink: 0;
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

  @media (max-width: 400px) {
    padding: 8px 14px;
    font-size: 10px;
  }

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
  padding: 10px 14px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 14px;
  }
`;

const PeriodGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 3px;
`;

const PeriodBtn = styled.button<{ $active: boolean }>`
  padding: 7px 4px;
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
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 7px 2px;
    letter-spacing: 0;
  }

  &:hover:not([disabled]) {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textPrimary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.06)'};
  }
`;

const CustomDateRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const TotalChip = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: rgba(204, 34, 34, 0.08);
  border: 1px solid rgba(204, 34, 34, 0.22);
  border-radius: 9999px;
  font-size: 9px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TotalValue = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.01em;
  text-transform: none;
`;

const MitarbeiterWrapper = styled.div`
  flex: 0 0 180px;
  min-width: 0;

  @media (max-width: 640px) {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const PeriodWrapper = styled.div`
  flex: 1;
  min-width: 260px;

  @media (max-width: 640px) {
    flex: 0 0 auto;
    min-width: 0;
    width: 100%;
  }
`;

const ExportRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 640px) {
    margin-left: 0;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    width: 100%;
  }
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

      <TabRow>
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
        {tab === 'view' && !loading && entries.length > 0 && (
          <TotalChip>
            Gesamt <TotalValue>{totalH}:{String(totalM).padStart(2, '0')} h</TotalValue>
          </TotalChip>
        )}
      </TabRow>

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
              <MitarbeiterWrapper>
                <FormGroup style={{ margin: 0 }}>
                  <Label>Mitarbeiter</Label>
                  <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{ padding: '7px 32px 7px 10px', fontSize: 12 }}
                  >
                    <option value="">Alle Mitarbeiter</option>
                    {users.map((u) => (
                      <option key={u.uid} value={u.uid}>{u.name}</option>
                    ))}
                  </Select>
                </FormGroup>
              </MitarbeiterWrapper>
            )}

            <PeriodWrapper>
              <Label style={{ marginBottom: 4 }}>Zeitraum</Label>
              <PeriodGroup>
                <PeriodBtn $active={range === 'month'} onClick={() => setRange('month')}>Dieser Monat</PeriodBtn>
                <PeriodBtn $active={range === 'week'} onClick={() => setRange('week')}>Diese Woche</PeriodBtn>
                <PeriodBtn $active={range === 'all'} onClick={() => setRange('all')}>Alle</PeriodBtn>
                <PeriodBtn $active={range === 'custom'} onClick={() => setRange('custom')}>Eigener</PeriodBtn>
              </PeriodGroup>
            </PeriodWrapper>

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
                <FormGroup style={{ margin: 0 }}>
                  <Label style={{ visibility: 'hidden', userSelect: 'none' }}>_</Label>
                  <Button onClick={exportToExcel} title="Excel exportieren" style={{ padding: '10px 13px', width: '100%' }}>
                    <FiDownload size={16} />
                  </Button>
                </FormGroup>
              </ExportRow>
            )}

            {range === 'custom' && (
              <CustomDateRow style={{ flexBasis: '100%', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <FormGroup style={{ margin: 0 }}>
                  <Label>Von</Label>
                  <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} style={{ width: 150 }} />
                </FormGroup>
                <FormGroup style={{ margin: 0 }}>
                  <Label>Bis</Label>
                  <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} style={{ width: 150 }} />
                </FormGroup>
                <FormGroup style={{ margin: 0 }}>
                  <Label style={{ visibility: 'hidden', userSelect: 'none' }}>_</Label>
                  <Button onClick={load} $variant="secondary">Laden</Button>
                </FormGroup>
              </CustomDateRow>
            )}
          </FilterBar>

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
