import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { RangePreset } from '@features/hours/hooks/useHoursPage';

export interface PeriodInput {
  range: RangePreset;
  /** "YYYY-MM" */
  pickedMonth: string;
  /** "YYYY-MM-DD" */
  customFrom: string;
  /** "YYYY-MM-DD" */
  customTo: string;
}

const parseMonth = (yyyyMm: string): Date => {
  const [y, m] = yyyyMm.split('-').map(Number);
  const now = new Date();
  return new Date(y || now.getFullYear(), (m || now.getMonth() + 1) - 1);
};

/** Konkrete Start-/Enddaten des aktiven Zeitraums. */
export const getPeriodBounds = ({
  range,
  pickedMonth,
  customFrom,
  customTo,
}: PeriodInput): [Date, Date] => {
  const now = new Date();

  if (range === 'week') {
    return [startOfWeek(now, { locale: de }), endOfWeek(now, { locale: de })];
  }
  if (range === 'pick') {
    const d = parseMonth(pickedMonth);
    return [startOfMonth(d), endOfMonth(d)];
  }
  if (range === 'custom') {
    return [
      customFrom ? new Date(customFrom + 'T00:00:00') : startOfMonth(now),
      customTo ? new Date(customTo + 'T23:59:59') : now,
    ];
  }
  return [startOfMonth(now), endOfMonth(now)];
};

/** Kurzer Titel über der Stundensumme, z. B. "August 2026". */
export const formatPeriodTitle = (input: PeriodInput): string => {
  if (input.range === 'week') return 'Diese Woche';
  if (input.range === 'custom') return 'Eigener Zeitraum';
  const d = input.range === 'pick' ? parseMonth(input.pickedMonth) : new Date();
  return format(d, 'MMMM yyyy', { locale: de });
};

/** Exakter Zeitraum, z. B. "01.–31. August 2026" oder "28. Aug – 03. Sep 2026". */
export const formatPeriodRange = (input: PeriodInput): string => {
  const [from, to] = getPeriodBounds(input);
  if (isSameMonth(from, to)) {
    return `${format(from, 'dd.')}–${format(to, 'dd. MMMM yyyy', { locale: de })}`;
  }
  return `${format(from, 'dd. MMM', { locale: de })} – ${format(to, 'dd. MMM yyyy', { locale: de })}`;
};
