import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { WorkHourEntry } from '@shared/types';
import { formatHM, parseIsoDate } from './timeUtils';

const fmtMoney = (n: number): string =>
  n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const sumMinutes = (entries: WorkHourEntry[]): number =>
  entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

/** One shift as a text line: "05.10. Mo. · 08:20–17:00 · −30min · Objekt" */
const shiftLine = (e: WorkHourEntry): string => {
  const dateStr = format(parseIsoDate(e.date), 'dd.MM. EEE', { locale: de });
  const pause = e.breakMinutes > 0 ? `−${e.breakMinutes}min` : '';
  return [dateStr, `${e.startTime}–${e.endTime}`, pause, e.objectTitle || '–']
    .filter(Boolean)
    .join(' · ');
};

const byDateAsc = (a: WorkHourEntry, b: WorkHourEntry) => a.date.localeCompare(b.date);

export const buildReport = (
  entries: WorkHourEntry[],
  periodLabel: string,
  workerLabel: string,
): string => {
  const header = `Arbeitsbericht ${periodLabel}${workerLabel ? ' – ' + workerLabel : ''}`;
  const lines = [...entries].sort(byDateAsc).map(shiftLine);
  return `${header}\n\n${lines.join('\n')}\n\nGesamt: ${formatHM(sumMinutes(entries))} h`;
};

export interface WageBlock {
  userName: string;
  entries: WorkHourEntry[];
  mins: number;
}

/** Ready-to-send wage text: one block per employee. `rate` is € per hour (0 = not entered). */
export const buildWageReport = (
  blocks: WageBlock[],
  periodLabel: string,
  rate: number,
): string => {
  const parts = blocks.map((b) => {
    const lines = [...b.entries].sort(byDateAsc).map(shiftLine);
    const summary = [`Gesamt: ${formatHM(b.mins)} h`];
    if (rate > 0) {
      summary.push(`Stundenlohn: ${fmtMoney(rate)} €/h`);
      summary.push(`Lohn gesamt: ${fmtMoney((b.mins / 60) * rate)} €`);
    }
    return [`Mitarbeiter: ${b.userName}`, '', ...lines, '', ...summary].join('\n');
  });
  return [`Lohnabrechnung ${periodLabel}`, '', parts.join('\n\n')].join('\n');
};

// xlsx is large — load it only when someone actually exports
export const exportExcel = async (entries: WorkHourEntry[], monthLabel: string): Promise<void> => {
  const XLSX = await import('xlsx');
  const rows = entries.map((e) => ({
    Mitarbeiter: e.userName,
    Objekt: e.objectTitle ?? '—',
    Datum: e.date,
    Stunden: formatHM(e.totalMinutes),
  }));

  rows.push({
    Mitarbeiter: 'GESAMT',
    Objekt: '',
    Datum: '',
    Stunden: formatHM(sumMinutes(entries)),
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 24 }, { wch: 28 }, { wch: 14 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Stunden');

  XLSX.writeFile(wb, `Bericht_${monthLabel}.xlsx`);
};
