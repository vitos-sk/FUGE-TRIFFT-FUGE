import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns';
import { de } from 'date-fns/locale';

/** Months are passed around as "YYYY-MM". */
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export const isValidMonth = (v: string | null | undefined): v is string =>
  !!v && MONTH_RE.test(v);

export const currentMonth = (): string => format(new Date(), 'yyyy-MM');

const parseMonth = (ym: string): Date => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1);
};

export const monthBounds = (ym: string): [Date, Date] => {
  const d = parseMonth(ym);
  return [startOfMonth(d), endOfMonth(d)];
};

export const shiftMonth = (ym: string, delta: number): string =>
  format(addMonths(parseMonth(ym), delta), 'yyyy-MM');

/** "YYYY-MM-DD" -> "YYYY-MM" */
export const monthOfDate = (iso: string): string => iso.slice(0, 7);

/** "Oktober 2026" */
export const formatMonthTitle = (ym: string): string =>
  format(parseMonth(ym), 'MMMM yyyy', { locale: de });

/** "01.–31. Oktober 2026" */
export const formatMonthRange = (ym: string): string => {
  const [from, to] = monthBounds(ym);
  return `${format(from, 'dd.')}–${format(to, 'dd. MMMM yyyy', { locale: de })}`;
};
