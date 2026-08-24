import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  getQuarter,
  format,
} from 'date-fns';
import { de } from 'date-fns/locale';

export type DashboardPeriod = 'week' | 'month' | 'quarter' | 'year';

/** Granularität der X-Achse und der Heatmap-Spalten. */
export type Bucket = 'day' | 'week' | 'month';

export interface PeriodBounds {
  period: DashboardPeriod;
  bucket: Bucket;
  /** 'yyyy-MM-dd' – aktueller Zeitraum */
  start: string;
  end: string;
  /** 'yyyy-MM-dd' – gleich langer Vorzeitraum, Basis für alle Trends */
  prevStart: string;
  prevEnd: string;
  /** z. B. 'August 2026', 'Q3 2026' */
  label: string;
  /** z. B. 'vs. Vormonat' */
  prevLabel: string;
}

export interface BucketDef {
  key: string;
  label: string;
  sub: string;
  start: string;
  end: string;
  isCurrent: boolean;
  isFuture: boolean;
}

export const DASHBOARD_PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'week', label: 'Woche' },
  { value: 'month', label: 'Monat' },
  { value: 'quarter', label: 'Quartal' },
  { value: 'year', label: 'Jahr' },
];

export const toIso = (d: Date): string => format(d, 'yyyy-MM-dd');

const BUCKET_BY_PERIOD: Record<DashboardPeriod, Bucket> = {
  week: 'day',
  month: 'day',
  quarter: 'week',
  year: 'month',
};

const PREV_LABEL: Record<DashboardPeriod, string> = {
  week: 'vs. Vorwoche',
  month: 'vs. Vormonat',
  quarter: 'vs. Vorquartal',
  year: 'vs. Vorjahr',
};

const boundsOf = (period: DashboardPeriod, d: Date): [Date, Date] => {
  if (period === 'week') return [startOfWeek(d, { locale: de }), endOfWeek(d, { locale: de })];
  if (period === 'month') return [startOfMonth(d), endOfMonth(d)];
  if (period === 'quarter') return [startOfQuarter(d), endOfQuarter(d)];
  return [startOfYear(d), endOfYear(d)];
};

const shiftBack = (period: DashboardPeriod, d: Date): Date => {
  if (period === 'week') return subWeeks(d, 1);
  if (period === 'month') return subMonths(d, 1);
  if (period === 'quarter') return subQuarters(d, 1);
  return subYears(d, 1);
};

const labelOf = (period: DashboardPeriod, from: Date, to: Date): string => {
  if (period === 'week') {
    return `KW ${format(from, 'w', { locale: de })} · ${format(from, 'dd.MM.')}–${format(to, 'dd.MM.yyyy')}`;
  }
  if (period === 'month') return format(from, 'MMMM yyyy', { locale: de });
  if (period === 'quarter') return `Q${getQuarter(from)} ${format(from, 'yyyy')}`;
  return format(from, 'yyyy');
};

/** Aktueller Zeitraum + gleich langer Vorzeitraum für Trendvergleiche. */
export const getDashboardBounds = (
  period: DashboardPeriod,
  now: Date = new Date()
): PeriodBounds => {
  const [from, to] = boundsOf(period, now);
  const [prevFrom, prevTo] = boundsOf(period, shiftBack(period, from));

  return {
    period,
    bucket: BUCKET_BY_PERIOD[period],
    start: toIso(from),
    end: toIso(to),
    prevStart: toIso(prevFrom),
    prevEnd: toIso(prevTo),
    label: labelOf(period, from, to),
    prevLabel: PREV_LABEL[period],
  };
};

/** Spalten des Zeitraums – Basis für Verlaufsdiagramm und Heatmap. */
export const getBuckets = (bounds: PeriodBounds, now: Date = new Date()): BucketDef[] => {
  const today = toIso(now);
  const from = new Date(bounds.start + 'T12:00:00');
  const to = new Date(bounds.end + 'T12:00:00');

  if (bounds.bucket === 'day') {
    return eachDayOfInterval({ start: from, end: to }).map((d) => {
      const key = toIso(d);
      return {
        key,
        label:
          bounds.period === 'week'
            ? format(d, 'EEEEEE', { locale: de })
            : format(d, 'd'),
        sub: format(d, 'dd.MM.'),
        start: key,
        end: key,
        isCurrent: key === today,
        isFuture: key > today,
      };
    });
  }

  if (bounds.bucket === 'week') {
    return eachWeekOfInterval({ start: from, end: to }, { locale: de }).map((d) => {
      const wStart = startOfWeek(d, { locale: de });
      const wEnd = endOfWeek(d, { locale: de });
      const start = toIso(wStart);
      const end = toIso(wEnd);
      return {
        key: start,
        label: `KW ${format(wStart, 'w', { locale: de })}`,
        sub: `${format(wStart, 'dd.MM.')}–${format(wEnd, 'dd.MM.')}`,
        start,
        end,
        isCurrent: today >= start && today <= end,
        isFuture: start > today,
      };
    });
  }

  return eachMonthOfInterval({ start: from, end: to }).map((d) => {
    const start = toIso(startOfMonth(d));
    const end = toIso(endOfMonth(d));
    return {
      key: start,
      label: format(d, 'MMM', { locale: de }),
      sub: format(d, 'MMMM yyyy', { locale: de }),
      start,
      end,
      isCurrent: today >= start && today <= end,
      isFuture: start > today,
    };
  });
};
