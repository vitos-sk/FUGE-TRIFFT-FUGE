import React, { useState, useEffect } from 'react';
import { FiDownload, FiCopy, FiCheck, FiList } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { LuCalculator } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { AddHoursForm } from '@features/hours/components/AddHoursForm';
import { HoursTable } from '@features/hours/components/HoursTable';
import { Button } from '@shared/ui/Button';
import { Select, Input, FormGroup, Label } from '@shared/ui/Input';
import { Modal } from '@shared/ui/Modal';
import { useHoursPage } from '@features/hours/hooks/useHoursPage';
import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';
import { OfflineBanner } from '@shared/ui/OfflineBanner';
import type { WorkHourEntry } from '@shared/types';

// ─── Report builder ───────────────────────────────────────────────────────────

function buildReport(entries: WorkHourEntry[], periodLabel: string, workerLabel: string): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const header = `Arbeitsbericht ${periodLabel}${workerLabel ? ' – ' + workerLabel : ''}`;

  const lines = sorted.map((e) => {
    const dateStr = format(new Date(e.date + 'T12:00:00'), 'dd.MM. EEE', { locale: de });
    const time    = `${e.startTime}–${e.endTime}`;
    const pause   = e.breakMinutes > 0 ? `-${e.breakMinutes}min` : '';
    const obj     = e.objectTitle || '–';
    const parts   = [dateStr, time, pause, obj].filter(Boolean);
    return parts.join(' · ');
  });

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const th = Math.floor(totalMins / 60);
  const tm = totalMins % 60;
  const footer = `Gesamt: ${th}:${String(tm).padStart(2, '0')} h`;

  return `${header}\n\n${lines.join('\n')}\n\n${footer}`;
}

// ─── Wage report builder ──────────────────────────────────────────────────────

const fmtH = (mins: number) =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')} h`;

const fmtEur = (amount: number) =>
  amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

function buildWageReport(
  entries: WorkHourEntry[],
  rate: number,
  periodLabel: string,
  workerLabel: string,
): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalWage = (totalMins / 60) * rate;

  const header = `Lohnabrechnung ${periodLabel}${workerLabel ? ' – ' + workerLabel : ''}`;
  const summary = [
    `Gesamtstunden: ${fmtH(totalMins)} (Pausen bereits abgezogen)`,
    `Stundenlohn:   ${fmtEur(rate)}/h`,
    `Lohn gesamt:   ${fmtEur(totalWage)}`,
  ].join('\n');

  const lines = sorted.map((e) => {
    const dateStr = format(new Date(e.date + 'T12:00:00'), 'dd.MM. EEE', { locale: de });
    const obj     = e.objectTitle || '–';
    const wage    = (e.totalMinutes / 60) * rate;
    return `${dateStr} | ${obj} | ${fmtH(e.totalMinutes)} | ${fmtEur(wage)}`;
  });

  return `${header}\n\n${summary}\n\nAufschlüsselung:\n${lines.join('\n')}`;
}

// ─── Wage modal styled ────────────────────────────────────────────────────────

const RateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const RateInputWrap = styled.div`
  position: relative;
  flex: 1;
`;

const RateInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 22px;
  font-weight: 700;
  padding: 10px 46px 10px 14px;
  outline: none;
  &:focus { border-color: rgba(255,255,255,0.22); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; font-weight: 400; }
`;

const RateSuffix = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const WageDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  margin: 0 0 18px;
`;

const WageSummaryBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 16px;
  margin-bottom: 20px;
`;

const WageSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  & + & { margin-top: 6px; }
`;

const WageSummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

const WageTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const WageTotalLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const WageTotalValue = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;
`;

const WageBreakdownTitle = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
`;

const WageBreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const WageBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: rgba(255,255,255,0.02);
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  &:nth-child(even) { background: rgba(255,255,255,0.04); }
`;

const WageRowLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

const WageRowDate = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const WageRowObj = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

const WageRowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
`;

const WageRowHours = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const WageRowAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const WageModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
`;

const WageCopyBtn = styled.button<{ $done: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: 1px solid ${({ $done }) => $done ? 'rgba(34,163,90,0.4)' : 'rgba(255,255,255,0.12)'};
  background: ${({ $done }) => $done ? 'rgba(34,163,90,0.08)' : 'rgba(255,255,255,0.04)'};
  color: ${({ $done }) => $done ? '#22a35a' : '#ccc'};
  transition: all 0.15s;
  cursor: pointer;
  &:hover {
    border-color: ${({ $done }) => $done ? 'rgba(34,163,90,0.4)' : 'rgba(255,255,255,0.22)'};
    color: ${({ $done }) => $done ? '#22a35a' : '#fff'};
  }
`;

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
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const TabBar = styled.div`
  display: flex;
  gap: 4px;
  background: #0c0c0c;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 4px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  ${({ $active }) => $active ? css`
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.9);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  ` : css`
    background: transparent;
    color: rgba(255,255,255,0.3);
  `}

  &:hover:not(:disabled) {
    ${({ $active }) => !$active && css`
      color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.05);
    `}
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 5px 14px;
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
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $active }) => $active ? css`
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.9);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  ` : css`
    background: transparent;
    color: rgba(255,255,255,0.35);
  `}

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 7px 2px;
    letter-spacing: 0;
  }

  &:hover:not([disabled]) {
    ${({ $active }) => !$active && css`
      color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.05);
    `}
  }
`;

const MonthBtnWrap = styled.div`
  position: relative;
`;

const MonthDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.55);
  min-width: 150px;
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
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;

  @media (max-width: 640px) {
    margin-left: 0;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    width: 100%;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ActionBtn = styled.button<{ $variant: 'copy' | 'wage'; $done?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;

  @media (max-width: 480px) {
    flex: 1;
    min-width: 0;
    padding: 5px 14px;
    font-size: 13px;
  }

  ${({ $variant, $done }) => $variant === 'copy' && !$done && css`
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.7);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    &:hover { background: rgba(255,255,255,0.11); color: rgba(255,255,255,0.9); }
  `}
  ${({ $variant, $done }) => $variant === 'copy' && $done && css`
    border: 1px solid rgba(34,163,90,0.45);
    background: rgba(34,163,90,0.1);
    color: #22a35a;
  `}
  ${({ $variant }) => $variant === 'wage' && css`
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.7);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    &:hover { background: rgba(255,255,255,0.11); color: rgba(255,255,255,0.9); }
  `}
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonWrap = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
`;

const SkeletonRow = styled.div<{ $w?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  &:last-child { border-bottom: none; }
`;

const SkeletonCell = styled.div<{ $w?: string; $h?: string }>`
  height: ${({ $h }) => $h ?? '11px'};
  width: ${({ $w }) => $w ?? '80px'};
  border-radius: 5px;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%
  );
  background-size: 200% 100%;
  animation: skshimmer 1.6s ease-in-out infinite;
  flex-shrink: 0;

  @keyframes skshimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const RefreshDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  animation: pulse 1.2s ease-in-out infinite;
  margin-left: 6px;
  vertical-align: middle;

  @keyframes pulse {
    0%, 100% { opacity: 0.25; }
    50%       { opacity: 0.7; }
  }
`;

const SKELETON_ROWS = 5;

function TableSkeleton() {
  return (
    <SkeletonWrap>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <SkeletonRow key={i}>
          <SkeletonCell $w="60px" />
          <SkeletonCell $w="90px" />
          <SkeletonCell $w="70px" />
          <SkeletonCell $w="110px" style={{ flex: 1, maxWidth: 160 }} />
          <SkeletonCell $w="44px" style={{ marginLeft: 'auto' }} />
        </SkeletonRow>
      ))}
    </SkeletonWrap>
  );
}

const HoursPage: React.FC = () => {
  const {
    isAdmin,
    tab, setTab,
    entries,
    users,
    selectedUser, setSelectedUser,
    range, setRange,
    pickedMonth, setPickedMonth,
    loading,
    refreshing,
    exportMonth, setExportMonth,
    load,
    exportToExcel,
  } = useHoursPage();
  const isOnline = useOnlineStatus();

  const [copied, setCopied] = useState(false);
  const [showWageModal, setShowWageModal] = useState(false);

  useEffect(() => {
    let startX = 0, startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.75) return;
      if ((e.target as Element).closest('table')) return;
      if (dx < 0) setTab(isAdmin ? 'add' : 'view');
      else setTab(isAdmin ? 'view' : 'add');
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchend', onEnd);
    };
  }, [isAdmin, setTab]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [wageCopied, setWageCopied] = useState(false);

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalH = Math.floor(totalMins / 60);
  const totalM = totalMins % 60;

  const getPeriodAndWorker = () => {
    const now = new Date();
    let periodLabel: string;
    if (range === 'month') {
      periodLabel = format(now, 'MMMM yyyy', { locale: de });
    } else if (range === 'week') {
      const ws = startOfWeek(now, { locale: de });
      const we = endOfWeek(now, { locale: de });
      periodLabel = `${format(ws, 'dd.MM.')}–${format(we, 'dd.MM.yyyy')}`;
    } else if (range === 'pick') {
      const [y, m] = pickedMonth.split('-').map(Number);
      periodLabel = format(new Date(y, m - 1), 'MMMM yyyy', { locale: de });
    } else {
      periodLabel = format(now, 'yyyy');
    }
    const workerLabel = !isAdmin
      ? (entries[0]?.userName ?? '')
      : selectedUser ? (users.find((u) => u.uid === selectedUser)?.name ?? '') : '';
    return { periodLabel, workerLabel };
  };

  const handleCopyReport = () => {
    const { periodLabel, workerLabel } = getPeriodAndWorker();
    navigator.clipboard.writeText(buildReport(entries, periodLabel, workerLabel));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const rate = parseFloat(hourlyRate.replace(',', '.')) || 0;
  const totalWage = (totalMins / 60) * rate;
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const handleCopyWage = () => {
    const { periodLabel, workerLabel } = getPeriodAndWorker();
    navigator.clipboard.writeText(buildWageReport(entries, rate, periodLabel, workerLabel));
    setWageCopied(true);
    setTimeout(() => setWageCopied(false), 2500);
  };

  return (
    <>
      <PageTitle>Arbeitsstunden</PageTitle>

      <TabRow>
        <TabBar>
          {isAdmin ? (
            <>
              <Tab $active={tab === 'view'} onClick={() => setTab('view')}><FiList size={15} />Übersicht</Tab>
              <Tab $active={tab === 'add'} onClick={() => setTab('add')}><HiPlus size={17} />Eintragen</Tab>
            </>
          ) : (
            <>
              <Tab $active={tab === 'add'} onClick={() => setTab('add')}><HiPlus size={17} />Eintragen</Tab>
              <Tab $active={tab === 'view'} onClick={() => setTab('view')}><FiList size={15} />Übersicht</Tab>
            </>
          )}
        </TabBar>
        {tab === 'view' && !loading && entries.length > 0 && (
          <TotalChip>
            Gesamt <TotalValue>{totalH}:{String(totalM).padStart(2, '0')} h</TotalValue>
          </TotalChip>
        )}
      </TabRow>

      {tab === 'view' && !loading && entries.length > 0 && (
        <ActionRow>
          <ActionBtn $variant="copy" $done={copied} onClick={handleCopyReport}>
            {copied ? <FiCheck size={15} /> : <FiCopy size={15} />}
            {copied ? 'Kopiert!' : 'Bericht kopieren'}
          </ActionBtn>
          {isAdmin && (
            <ActionBtn $variant="wage" onClick={() => setShowWageModal(true)}>
              <LuCalculator size={14} />
              € Lohn berechnen
            </ActionBtn>
          )}
        </ActionRow>
      )}

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
                <MonthBtnWrap>
                  <PeriodBtn $active={range === 'pick'} onClick={() => setRange(range === 'pick' ? 'month' : 'pick')} style={{ width: '100%' }}>Monat ▾</PeriodBtn>
                  {range === 'pick' && (
                    <>
                      <div onClick={() => setRange('month')} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
                      <MonthDropdown>
                        <Input
                          type="month"
                          value={pickedMonth}
                          onChange={(e) => setPickedMonth(e.target.value)}
                          style={{ width: '100%', fontSize: 13, padding: '6px 10px' }}
                        />
                      </MonthDropdown>
                    </>
                  )}
                </MonthBtnWrap>
              </PeriodGroup>
            </PeriodWrapper>

            {isAdmin && (
              <ExportRow>
                <Input
                  type="month"
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value)}
                  style={{ padding: '7px 8px', fontSize: 11, minWidth: 130 }}
                />
                <Button onClick={exportToExcel} title="Excel exportieren" style={{ padding: '7px 10px', flexShrink: 0 }}>
                  <FiDownload size={14} />
                </Button>
              </ExportRow>
            )}

          </FilterBar>

          {!isOnline && !loading && entries.length === 0 && (
            <OfflineBanner message="Kein Internet – Stunden können nicht geladen werden" />
          )}
          {loading ? (
            <TableSkeleton />
          ) : (
            <>
              <HoursTable entries={entries} showWorker={isAdmin && !selectedUser} onDelete={load} />
              {refreshing && <div style={{ textAlign: 'center', padding: '10px 0 2px', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Aktualisierung<RefreshDot /></div>}
            </>
          )}
        </>
      )}

      <Modal isOpen={showWageModal} onClose={() => setShowWageModal(false)} title="Lohnberechnung" width="500px">
        <RateRow>
          <RateInputWrap>
            <RateInput
              type="text"
              inputMode="decimal"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="0,00"
              autoFocus
            />
            <RateSuffix>€/h</RateSuffix>
          </RateInputWrap>
        </RateRow>

        {rate > 0 && (
          <>
            <WageDivider />

            <WageSummaryBox>
              <WageSummaryRow>
                <WageSummaryLabel>Gesamtstunden (Pausen abgezogen)</WageSummaryLabel>
                <span>{fmtH(totalMins)}</span>
              </WageSummaryRow>
              <WageSummaryRow>
                <WageSummaryLabel>Stundenlohn</WageSummaryLabel>
                <span>{fmtEur(rate)} / h</span>
              </WageSummaryRow>
              <WageTotalRow>
                <WageTotalLabel>Lohn gesamt</WageTotalLabel>
                <WageTotalValue>{fmtEur(totalWage)}</WageTotalValue>
              </WageTotalRow>
            </WageSummaryBox>

            <WageBreakdownTitle>Aufschlüsselung pro Tag</WageBreakdownTitle>
            <WageBreakdownList>
              {sortedEntries.map((e) => {
                const dateStr = format(new Date(e.date + 'T12:00:00'), 'dd.MM. EEE', { locale: de });
                const entryWage = (e.totalMinutes / 60) * rate;
                return (
                  <WageBreakdownRow key={e.id}>
                    <WageRowLeft>
                      <WageRowDate>{dateStr}</WageRowDate>
                      <WageRowObj>{e.objectTitle || '—'}</WageRowObj>
                    </WageRowLeft>
                    <WageRowRight>
                      <WageRowHours>{fmtH(e.totalMinutes)}</WageRowHours>
                      <WageRowAmount>{fmtEur(entryWage)}</WageRowAmount>
                    </WageRowRight>
                  </WageBreakdownRow>
                );
              })}
            </WageBreakdownList>
          </>
        )}

        <WageModalFooter>
          {rate > 0 && (
            <WageCopyBtn $done={wageCopied} onClick={handleCopyWage}>
              {wageCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
              {wageCopied ? 'Kopiert!' : 'Abrechnung kopieren'}
            </WageCopyBtn>
          )}
          <Button $variant="secondary" onClick={() => setShowWageModal(false)}>
            Schließen
          </Button>
        </WageModalFooter>
      </Modal>
    </>
  );
};

export default HoursPage;
