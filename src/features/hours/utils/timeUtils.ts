export const BREAK_OPTIONS = [0, 10, 15, 30, 60].map((b) => ({
  value: b,
  label: b === 0 ? 'Keine' : `${b} min`,
}));

export const calcMinutes = (start: string, end: string, brk: number): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let endMins = eh * 60 + em;
  const startMins = sh * 60 + sm;
  if (endMins <= startMins) endMins += 24 * 60;
  return Math.max(0, endMins - startMins - brk);
};

export const formatMinutes = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')} h`;
};

export const formatDateDisplay = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};
