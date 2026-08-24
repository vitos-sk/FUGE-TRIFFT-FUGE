import { ROLE } from '@constants';
import type { WorkHourEntry, AppUser, CRMObject, Task } from '@shared/types';
import type { BucketDef } from './period';

/** Farbreihenfolge für Objekt-Serien (Akzentfarbe zuerst). */
export const SERIES_COLORS = [
  '#cc2222',
  '#c9a84c',
  '#22a35a',
  '#3b82f6',
  '#8b5cf6',
  '#f97316',
];

export const OTHER_COLOR = '#3f3f3f';
export const NO_OBJECT_TITLE = 'Ohne Objekt';

const MIN_PER_HOUR = 60;
const LONG_SHIFT_MINUTES = 12 * MIN_PER_HOUR;
const NO_BREAK_THRESHOLD = 6 * MIN_PER_HOUR;
const ANOMALY_WINDOW_DAYS = 7;

export const sumMinutes = (entries: WorkHourEntry[]): number =>
  entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

const distinct = <T>(values: T[]): T[] => Array.from(new Set(values));

/** Prozentuale Veränderung; null wenn kein Vergleichswert existiert. */
const trend = (current: number, previous: number): number | null => {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
};

const inRange = (date: string, from: string, to: string): boolean =>
  date >= from && date <= to;

export const filterRange = (
  entries: WorkHourEntry[],
  from: string,
  to: string
): WorkHourEntry[] => entries.filter((e) => inRange(e.date, from, to));

/* ------------------------------------------------------------------ KPIs */

export interface DashboardKpis {
  totalMinutes: number;
  totalTrend: number | null;
  workdays: number;
  avgPerWorkday: number;
  avgTrend: number | null;
  activeWorkers: number;
  totalWorkers: number;
  objectCount: number;
  objectTrend: number | null;
}

const workdayCount = (entries: WorkHourEntry[]): number =>
  distinct(entries.map((e) => e.date)).length;

const objectCount = (entries: WorkHourEntry[]): number =>
  distinct(entries.filter((e) => e.objectId).map((e) => e.objectId as string)).length;

export const buildKpis = (
  current: WorkHourEntry[],
  previous: WorkHourEntry[],
  users: AppUser[]
): DashboardKpis => {
  const totalMinutes = sumMinutes(current);
  const prevMinutes = sumMinutes(previous);

  const workdays = workdayCount(current);
  const prevWorkdays = workdayCount(previous);

  const avgPerWorkday = workdays ? Math.round(totalMinutes / workdays) : 0;
  const prevAvg = prevWorkdays ? Math.round(prevMinutes / prevWorkdays) : 0;

  const objects = objectCount(current);

  return {
    totalMinutes,
    totalTrend: trend(totalMinutes, prevMinutes),
    workdays,
    avgPerWorkday,
    avgTrend: trend(avgPerWorkday, prevAvg),
    activeWorkers: distinct(current.map((e) => e.userId)).length,
    totalWorkers: users.filter((u) => u.role === ROLE.WORKER && !u.disabled).length,
    objectCount: objects,
    objectTrend: trend(objects, objectCount(previous)),
  };
};

/* --------------------------------------------------------------- Objekte */

export interface ObjectStat {
  objectId: string | null;
  title: string;
  minutes: number;
  share: number;
  workerCount: number;
  days: number;
  lastDate: string;
}

const objectKey = (e: WorkHourEntry): string => e.objectId ?? '__none__';

export const buildObjectStats = (entries: WorkHourEntry[]): ObjectStat[] => {
  const total = sumMinutes(entries);
  const map = new Map<string, { stat: ObjectStat; users: Set<string>; days: Set<string> }>();

  entries.forEach((e) => {
    const key = objectKey(e);
    let bucket = map.get(key);
    if (!bucket) {
      bucket = {
        stat: {
          objectId: e.objectId ?? null,
          title: e.objectTitle || (e.objectId ? 'Unbenanntes Objekt' : NO_OBJECT_TITLE),
          minutes: 0,
          share: 0,
          workerCount: 0,
          days: 0,
          lastDate: e.date,
        },
        users: new Set(),
        days: new Set(),
      };
      map.set(key, bucket);
    }
    bucket.stat.minutes += e.totalMinutes || 0;
    if (e.date > bucket.stat.lastDate) bucket.stat.lastDate = e.date;
    bucket.users.add(e.userId);
    bucket.days.add(e.date);
  });

  return Array.from(map.values())
    .map(({ stat, users, days }) => ({
      ...stat,
      workerCount: users.size,
      days: days.size,
      share: total ? Math.round((stat.minutes / total) * 100) : 0,
    }))
    .sort((a, b) => b.minutes - a.minutes);
};

/* ----------------------------------------------------------- Mitarbeiter */

export interface WorkerStat {
  userId: string;
  name: string;
  minutes: number;
  days: number;
  avgPerDay: number;
  objectCount: number;
  trendPct: number | null;
}

export type WorkerSortKey = 'minutes' | 'days' | 'avgPerDay' | 'objectCount' | 'name';

export const buildWorkerStats = (
  current: WorkHourEntry[],
  previous: WorkHourEntry[]
): WorkerStat[] => {
  const prevMinutes = new Map<string, number>();
  previous.forEach((e) => {
    prevMinutes.set(e.userId, (prevMinutes.get(e.userId) ?? 0) + (e.totalMinutes || 0));
  });

  const map = new Map<
    string,
    { name: string; minutes: number; days: Set<string>; objects: Set<string> }
  >();

  current.forEach((e) => {
    let bucket = map.get(e.userId);
    if (!bucket) {
      bucket = { name: e.userName, minutes: 0, days: new Set(), objects: new Set() };
      map.set(e.userId, bucket);
    }
    bucket.minutes += e.totalMinutes || 0;
    bucket.days.add(e.date);
    if (e.objectId) bucket.objects.add(e.objectId);
  });

  return Array.from(map.entries())
    .map(([userId, b]) => ({
      userId,
      name: b.name,
      minutes: b.minutes,
      days: b.days.size,
      avgPerDay: b.days.size ? Math.round(b.minutes / b.days.size) : 0,
      objectCount: b.objects.size,
      trendPct: trend(b.minutes, prevMinutes.get(userId) ?? 0),
    }))
    .sort((a, b) => b.minutes - a.minutes);
};

export const sortWorkerStats = (
  stats: WorkerStat[],
  key: WorkerSortKey,
  desc: boolean
): WorkerStat[] => {
  const sorted = [...stats].sort((a, b) =>
    key === 'name' ? a.name.localeCompare(b.name, 'de') : a[key] - b[key]
  );
  return desc ? sorted.reverse() : sorted;
};

/* ------------------------------------------------------------- Verlauf */

export interface TrendSeries {
  id: string;
  name: string;
  color: string;
}

export interface TrendRow {
  label: string;
  sub: string;
  total: number;
  isFuture: boolean;
  [seriesId: string]: string | number | boolean;
}

export interface TrendChartData {
  rows: TrendRow[];
  series: TrendSeries[];
}

const TOP_SERIES = 5;

/**
 * Gestapelte Serie je Bucket: Top-Objekte einzeln, der Rest als "Sonstige".
 * Serien-IDs sind bewusst technisch (s0, s1 …) – recharts interpretiert Punkte
 * in dataKeys als Pfad, Objekttitel wären dort nicht sicher.
 */
export const buildTrendSeries = (
  entries: WorkHourEntry[],
  buckets: BucketDef[]
): TrendChartData => {
  const stats = buildObjectStats(entries);
  const top = stats.slice(0, TOP_SERIES);
  const topKeys = new Map<string, string>();
  top.forEach((s, i) => topKeys.set(s.objectId ?? '__none__', `s${i}`));

  const hasOther = stats.length > TOP_SERIES;
  const series: TrendSeries[] = top.map((s, i) => ({
    id: `s${i}`,
    name: s.title,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));
  if (hasOther) series.push({ id: 'other', name: 'Sonstige', color: OTHER_COLOR });

  const rows: TrendRow[] = buckets.map((b) => {
    const row: TrendRow = { label: b.label, sub: b.sub, total: 0, isFuture: b.isFuture };
    series.forEach((s) => {
      row[s.id] = 0;
    });

    entries
      .filter((e) => inRange(e.date, b.start, b.end))
      .forEach((e) => {
        const id = topKeys.get(objectKey(e)) ?? 'other';
        if (!(id in row)) return;
        row[id] = (row[id] as number) + (e.totalMinutes || 0);
        row.total += e.totalMinutes || 0;
      });

    return row;
  });

  return { rows, series };
};

/* ------------------------------------------------------------- Heatmap */

export interface HeatmapRow {
  userId: string;
  name: string;
  cells: number[];
  total: number;
}

export interface HeatmapData {
  columns: BucketDef[];
  rows: HeatmapRow[];
  max: number;
}

export const buildHeatmap = (
  entries: WorkHourEntry[],
  buckets: BucketDef[],
  users: AppUser[]
): HeatmapData => {
  const names = new Map<string, string>();
  users
    .filter((u) => !u.disabled && u.role === ROLE.WORKER)
    .forEach((u) => names.set(u.uid, u.name));
  entries.forEach((e) => {
    if (!names.has(e.userId)) names.set(e.userId, e.userName);
  });

  const index = new Map(buckets.map((b, i) => [b.key, i]));
  const totals = new Map<string, number[]>();
  names.forEach((_, uid) => totals.set(uid, new Array(buckets.length).fill(0)));

  entries.forEach((e) => {
    const cells = totals.get(e.userId);
    if (!cells) return;
    const bucket = buckets.find((b) => inRange(e.date, b.start, b.end));
    if (!bucket) return;
    const i = index.get(bucket.key);
    if (i === undefined) return;
    cells[i] += e.totalMinutes || 0;
  });

  const rows: HeatmapRow[] = Array.from(names.entries())
    .map(([userId, name]) => {
      const cells = totals.get(userId) ?? [];
      return { userId, name, cells, total: cells.reduce((a, b) => a + b, 0) };
    })
    .sort((a, b) => b.total - a.total);

  const max = rows.reduce((m, r) => Math.max(m, ...r.cells), 0);

  return { columns: buckets, rows, max };
};

/* --------------------------------------------------------------- Heute */

export interface TodaySummary {
  active: { userId: string; name: string; minutes: number }[];
  missing: AppUser[];
  totalMinutes: number;
}

export const buildTodaySummary = (
  entries: WorkHourEntry[],
  users: AppUser[],
  today: string
): TodaySummary => {
  const todayEntries = entries.filter((e) => e.date === today);

  const byUser = new Map<string, { userId: string; name: string; minutes: number }>();
  todayEntries.forEach((e) => {
    const existing = byUser.get(e.userId);
    if (existing) existing.minutes += e.totalMinutes || 0;
    else byUser.set(e.userId, { userId: e.userId, name: e.userName, minutes: e.totalMinutes || 0 });
  });

  return {
    active: Array.from(byUser.values()).sort((a, b) => b.minutes - a.minutes),
    missing: users.filter(
      (u) => u.role === ROLE.WORKER && !u.disabled && !byUser.has(u.uid)
    ),
    totalMinutes: sumMinutes(todayEntries),
  };
};

/* ------------------------------------------------------------ Hinweise */

export type AnomalyType = 'long_shift' | 'overlap' | 'no_break';

export interface Anomaly {
  id: string;
  type: AnomalyType;
  userName: string;
  date: string;
  detail: string;
}

/** Minuten seit Mitternacht; Schichten über Mitternacht laufen über 24:00 hinaus. */
const toMinuteRange = (entry: WorkHourEntry): [number, number] => {
  const [sh, sm] = entry.startTime.split(':').map(Number);
  const [eh, em] = entry.endTime.split(':').map(Number);
  const start = sh * 60 + sm;
  let end = eh * 60 + em;
  if (end <= start) end += 24 * 60;
  return [start, end];
};

const shiftDate = (iso: string, days: number): string => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const findAnomalies = (entries: WorkHourEntry[], today: string): Anomaly[] => {
  const from = shiftDate(today, -(ANOMALY_WINDOW_DAYS - 1));
  const recent = entries.filter((e) => inRange(e.date, from, today));
  const found: Anomaly[] = [];

  recent.forEach((e) => {
    if ((e.totalMinutes || 0) > LONG_SHIFT_MINUTES) {
      found.push({
        id: `${e.id}-long`,
        type: 'long_shift',
        userName: e.userName,
        date: e.date,
        detail: `${e.startTime}–${e.endTime} · über 12 Stunden`,
      });
    }
    if ((e.totalMinutes || 0) >= NO_BREAK_THRESHOLD && !e.breakMinutes) {
      found.push({
        id: `${e.id}-break`,
        type: 'no_break',
        userName: e.userName,
        date: e.date,
        detail: `${e.startTime}–${e.endTime} · keine Pause erfasst`,
      });
    }
  });

  const byUserDay = new Map<string, WorkHourEntry[]>();
  recent.forEach((e) => {
    const key = `${e.userId}|${e.date}`;
    const list = byUserDay.get(key);
    if (list) list.push(e);
    else byUserDay.set(key, [e]);
  });

  byUserDay.forEach((list) => {
    if (list.length < 2) return;
    const ranges = list
      .map((e) => ({ entry: e, range: toMinuteRange(e) }))
      .sort((a, b) => a.range[0] - b.range[0]);

    for (let i = 1; i < ranges.length; i += 1) {
      const prev = ranges[i - 1];
      const cur = ranges[i];
      if (cur.range[0] < prev.range[1]) {
        found.push({
          id: `${cur.entry.id}-overlap`,
          type: 'overlap',
          userName: cur.entry.userName,
          date: cur.entry.date,
          detail: `${prev.entry.startTime}–${prev.entry.endTime} überschneidet ${cur.entry.startTime}–${cur.entry.endTime}`,
        });
      }
    }
  });

  return found.sort((a, b) => b.date.localeCompare(a.date));
};

/* -------------------------------------------------------------- Verlauf */

export type ActivityKind = 'note' | 'object' | 'task' | 'hours';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  at: number;
  title: string;
  detail: string;
  objectId?: string;
}

const ACTIVITY_LIMIT = 12;

const millis = (ts?: { toMillis?: () => number } | null): number => {
  if (!ts?.toMillis) return 0;
  try {
    return ts.toMillis();
  } catch {
    return 0;
  }
};

/**
 * Ereignisstrom aus bereits geladenen Daten. Notizen kommen aus den
 * denormalisierten Objektfeldern (lastNoteAt/-Text/-Author) – die Notizen selbst
 * liegen in Subcollections und wären nur per collectionGroup erreichbar.
 */
export const buildActivityFeed = (
  objects: CRMObject[],
  tasks: Task[],
  entries: WorkHourEntry[]
): ActivityItem[] => {
  const items: ActivityItem[] = [];

  objects.forEach((o) => {
    const noteAt = millis(o.lastNoteAt);
    if (noteAt && o.lastNoteText) {
      items.push({
        id: `note-${o.id}-${noteAt}`,
        kind: 'note',
        at: noteAt,
        title: o.title,
        detail: `${o.lastNoteAuthor ?? 'Notiz'}: ${o.lastNoteText}`,
        objectId: o.id,
      });
    }
    const createdAt = millis(o.createdAt);
    if (createdAt) {
      items.push({
        id: `object-${o.id}`,
        kind: 'object',
        at: createdAt,
        title: o.title,
        detail: `Neues Objekt · ${o.city || o.address || ''}`.trim(),
        objectId: o.id,
      });
    }
  });

  const objectTitles = new Map(objects.map((o) => [o.id, o.title]));
  tasks.forEach((t) => {
    const at = millis(t.createdAt);
    if (!at) return;
    const place = t.objectId
      ? objectTitles.get(t.objectId) ?? 'Objekt'
      : t.customLocation ?? '—';
    items.push({
      id: `task-${t.id}`,
      kind: 'task',
      at,
      title: place,
      detail: `Aufgabe: ${t.description}`,
      objectId: t.objectId ?? undefined,
    });
  });

  entries.forEach((e) => {
    const at = millis(e.createdAt);
    if (!at) return;
    items.push({
      id: `hours-${e.id}`,
      kind: 'hours',
      at,
      title: e.objectTitle || NO_OBJECT_TITLE,
      detail: `${e.userName} · ${e.startTime}–${e.endTime}`,
      objectId: e.objectId ?? undefined,
    });
  });

  return items.sort((a, b) => b.at - a.at).slice(0, ACTIVITY_LIMIT);
};
