import { format, isToday, isYesterday } from 'date-fns';
import { de } from 'date-fns/locale';

/** Section heading above a group of items: "Heute", "Gestern", "01. Juni 2026" */
export const formatDayHeading = (date: Date): string => {
  if (isToday(date)) return 'Heute';
  if (isYesterday(date)) return 'Gestern';
  return format(date, 'dd. MMMM yyyy', { locale: de });
};

/** Inline lowercase variant for meta rows: "heute", "gestern", "01.06.26" */
export const formatDayInline = (date: Date): string => {
  if (isToday(date)) return 'heute';
  if (isYesterday(date)) return 'gestern';
  return format(date, 'dd.MM.yy', { locale: de });
};
