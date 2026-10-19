export const BREAK_OPTIONS = [0, 10, 15, 30, 60].map((b) => ({
  value: b,
  label: b === 0 ? 'Keine' : `${b} min`,
}));

const MINUTES_PER_DAY = 24 * 60;

export const timeToMinutes = (t: string): number => {
  const [h = 0, m = 0] = t.split(':').map(Number);
  return h * 60 + m;
};

export const minutesToTime = (mins: number): string => {
  const n = ((mins % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
};

/** Moves "HH:MM" by `delta` minutes, wrapping around midnight. */
export const shiftTime = (t: string, delta: number): string =>
  minutesToTime(timeToMinutes(t) + delta);

export const calcMinutes = (start: string, end: string, brk: number): number => {
  if (!start || !end) return 0;
  const startMins = timeToMinutes(start);
  let endMins = timeToMinutes(end);
  if (endMins <= startMins) endMins += MINUTES_PER_DAY;
  return Math.max(0, endMins - startMins - brk);
};

/** Hours:minutes without unit, e.g. 0:30, 8:00, 236:30. */
export const formatHM = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

export const formatShiftCount = (n: number): string =>
  n === 1 ? '1 Schicht' : `${n} Schichten`;

export const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayIso = (): string => toIsoDate(new Date());

/** Parses "YYYY-MM-DD" as a local date at noon (safe around DST changes). */
export const parseIsoDate = (iso: string): Date => new Date(`${iso}T12:00:00`);
