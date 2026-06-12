import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';
import type { WorkHourEntry } from '@shared/types';
import {
  RateRow,
  RateInputWrap,
  RateInput,
  RateSuffix,
  WageDivider,
  WageSummaryBox,
  WageSummaryRow,
  WageSummaryLabel,
  WageTotalRow,
  WageTotalLabel,
  WageTotalValue,
  WageBreakdownTitle,
  WageBreakdownList,
  WageBreakdownRow,
  WageRowLeft,
  WageRowDate,
  WageRowObj,
  WageRowRight,
  WageRowHours,
  WageRowAmount,
  WageModalFooter,
  WageCopyBtn,
} from './WageModal.styles';

const fmtH = (mins: number) =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')} h`;

const fmtEur = (amount: number) =>
  amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

function buildWageReport(
  entries: WorkHourEntry[],
  periodLabel: string,
  workerLabel: string,
): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const th = Math.floor(totalMins / 60);
  const tm = totalMins % 60;

  const header = `Arbeitsbericht ${periodLabel}${workerLabel ? ' – ' + workerLabel : ''}`;
  const lines = sorted.map((e) => {
    const dateStr = format(new Date(e.date + 'T12:00:00'), 'dd.MM. EEE', { locale: de });
    const time  = `${e.startTime}–${e.endTime}`;
    const pause = e.breakMinutes > 0 ? `-${e.breakMinutes}min` : '';
    const obj   = e.objectTitle || '–';
    return [dateStr, time, pause, obj].filter(Boolean).join(' · ');
  });

  return `${header}\n\n${lines.join('\n')}\n\nGesamt: ${th}:${String(tm).padStart(2, '0')} h`;
}

interface WageModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: WorkHourEntry[];
  getPeriodAndWorker: () => { periodLabel: string; workerLabel: string };
}

export const WageModal: React.FC<WageModalProps> = ({
  isOpen,
  onClose,
  entries,
  getPeriodAndWorker,
}) => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [wageCopied, setWageCopied] = useState(false);

  const rate = parseFloat(hourlyRate.replace(',', '.')) || 0;
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalWage = (totalMins / 60) * rate;
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const handleCopyWage = () => {
    const { periodLabel, workerLabel } = getPeriodAndWorker();
    navigator.clipboard.writeText(buildWageReport(entries, periodLabel, workerLabel));
    setWageCopied(true);
    setTimeout(() => setWageCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lohnberechnung" width="500px" height="80dvh">
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
        <Button $variant="secondary" $size="sm" onClick={onClose}>
          Schließen
        </Button>
      </WageModalFooter>
    </Modal>
  );
};
