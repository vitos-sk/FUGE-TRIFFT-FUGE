import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { subDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { db } from '@shared/services/firebase';
import { getAllUsers } from '@shared/services/authService';
import { useObjects } from '@features/objects/hooks/useObjects';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { Spinner } from '@shared/ui/Spinner';
import type { WorkHourEntry, AppUser } from '@shared/types';

// ─── Styled ────────────────────────────────────────────────────────────────────

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DateTag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.5;
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr 1fr; }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px 22px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    opacity: 0.4;
  }
`;

const StatLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.03em;
  line-height: 1;
`;

const StatUnit = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 5px;
  letter-spacing: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ChartSection = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 24px 24px 18px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 22px;
`;

const ChartTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChartSub = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.5;
`;

const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  text-align: center;
  padding: 60px 0;
`;

const COLORS = ['#cc2222', '#c9a84c', '#22a35a', '#3b82f6', '#8b5cf6', '#f97316'];

// ─── Custom Tooltips ───────────────────────────────────────────────────────────

const TooltipBox = styled.div`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 9px 13px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  pointer-events: none;
`;

const TooltipLabel = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  letter-spacing: 0.04em;
`;

const TooltipValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
`;

const TooltipSub = styled.div`
  font-size: 10px;
  color: #555;
  margin-top: 3px;
`;

const WeekSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const WeekTotal = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const TrendBadge = styled.span<{ $up: boolean }>`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  background: ${({ $up }) => $up ? 'rgba(34,163,90,0.12)' : 'rgba(204,34,34,0.1)'};
  color: ${({ $up }) => $up ? '#22a35a' : '#cc2222'};
`;


const BarTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      <TooltipValue>{h}:{String(m).padStart(2, '0')} Std.</TooltipValue>
    </TooltipBox>
  );
};

const WeekTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { day: string; fullDate: string; minutes: number; workers: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const { day, fullDate, minutes, workers } = payload[0].payload;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return (
    <TooltipBox>
      <TooltipLabel>{day}, {fullDate}</TooltipLabel>
      {minutes > 0 ? (
        <>
          <TooltipValue>{h}:{String(m).padStart(2, '0')} Std.</TooltipValue>
          {workers > 0 && (
            <TooltipSub>{workers} {workers === 1 ? 'Person' : 'Personen'} aktiv</TooltipSub>
          )}
        </>
      ) : (
        <TooltipValue style={{ color: '#333' }}>Kein Eintrag</TooltipValue>
      )}
    </TooltipBox>
  );
};

const PieTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { hours: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const { name, payload: inner } = payload[0];
  return (
    <TooltipBox>
      <TooltipLabel>{name}</TooltipLabel>
      <TooltipValue>{inner.hours} Std.</TooltipValue>
    </TooltipBox>
  );
};

// ─── Component ─────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { objects } = useObjects();

  const [hours, setHours] = useState<WorkHourEntry[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
  }, [isAdmin, navigate]);

  useEffect(() => {
    getAllUsers().then((u) => setUsers(u.filter((x) => !x.disabled)));
  }, []);

  useEffect(() => {
    const from = format(subDays(new Date(), 29), 'yyyy-MM-dd');
    const q = query(collection(db, 'workHours'), where('date', '>=', from));
    const unsub = onSnapshot(q, (snap) => {
      setHours(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry)));
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spinner size={32} />
      </div>
    );
  }

  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(now, { locale: de }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { locale: de }), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const currentMonth = format(now, 'MMMM yyyy', { locale: de });

  const todayWorkers = new Set(
    hours.filter((e) => e.date === today).map((e) => e.userId)
  ).size;

  const weekMins = hours
    .filter((e) => e.date >= weekStart && e.date <= weekEnd)
    .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

  const activeObjects = objects.filter((o) => o.status === 'new' || o.status === 'in_progress').length;
  const totalWorkers = users.filter((u) => u.role === 'worker').length;

  // Bar chart: this week day-by-day
  const weeklyData = eachDayOfInterval({
    start: startOfWeek(now, { locale: de }),
    end: endOfWeek(now, { locale: de }),
  }).map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayHours = hours.filter((e) => e.date === dayStr);
    const mins = dayHours.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
    return {
      day: format(day, 'EEE', { locale: de }),
      fullDate: format(day, 'dd.MM.'),
      minutes: mins,
      workers: new Set(dayHours.map((e) => e.userId)).size,
      isToday: dayStr === today,
      isFuture: dayStr > today,
    };
  });

  const thisWeekMins = hours
    .filter((e) => e.date >= weekStart && e.date <= weekEnd)
    .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

  const lastWeekStart = format(startOfWeek(subDays(now, 7), { locale: de }), 'yyyy-MM-dd');
  const lastWeekEnd = format(endOfWeek(subDays(now, 7), { locale: de }), 'yyyy-MM-dd');
  const lastWeekMins = hours
    .filter((e) => e.date >= lastWeekStart && e.date <= lastWeekEnd)
    .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);

  const weekDiffMins = thisWeekMins - lastWeekMins;
  const weekDiffH = Math.abs(Math.floor(weekDiffMins / 60));
  const weekDiffM = Math.abs(weekDiffMins % 60);

  // Pie chart: current month per worker
  const workerMap: Record<string, { name: string; minutes: number }> = {};
  hours
    .filter((e) => e.date >= monthStart && e.date <= monthEnd)
    .forEach((e) => {
      if (!workerMap[e.userId]) workerMap[e.userId] = { name: e.userName, minutes: 0 };
      workerMap[e.userId].minutes += e.totalMinutes || 0;
    });
  const workerData = Object.values(workerMap)
    .sort((a, b) => b.minutes - a.minutes)
    .map((w) => ({
      name: w.name,
      minutes: w.minutes,
      hours: parseFloat((w.minutes / 60).toFixed(1)),
    }));

  return (
    <>
      <Header>
        <PageTitle>Dashboard</PageTitle>
        <DateTag>{format(now, 'dd. MMMM yyyy', { locale: de })}</DateTag>
      </Header>

      <CardsRow>
        <StatCard>
          <StatLabel>Heute aktiv</StatLabel>
          <StatValue>{todayWorkers}<StatUnit>Pers.</StatUnit></StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Stunden diese Woche</StatLabel>
          <StatValue>{(weekMins / 60).toFixed(1)}<StatUnit>Std.</StatUnit></StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Aktive Objekte</StatLabel>
          <StatValue>{activeObjects}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Mitarbeiter gesamt</StatLabel>
          <StatValue>{totalWorkers}</StatValue>
        </StatCard>
      </CardsRow>

      <ChartsGrid>
        <ChartSection>
          <ChartHeader>
            <div>
              <ChartTitle>Diese Woche</ChartTitle>
              <WeekSummary style={{ marginTop: 6 }}>
                <WeekTotal>
                  {Math.floor(thisWeekMins / 60)}:{String(thisWeekMins % 60).padStart(2, '0')} Std.
                </WeekTotal>
                {lastWeekMins > 0 && (
                  <TrendBadge $up={weekDiffMins >= 0}>
                    {weekDiffMins >= 0 ? '↑' : '↓'} {weekDiffH}:{String(weekDiffM).padStart(2, '0')}h vs. VW
                  </TrendBadge>
                )}
              </WeekSummary>
            </div>
            <ChartSub>{format(now, "'KW' w", { locale: de })}</ChartSub>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={({ x, y, payload, index }) => {
                  const d = weeklyData[index];
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} dy={12} textAnchor="middle" fill={d.isToday ? '#cc2222' : '#3a3a3a'} fontSize={11} fontWeight={d.isToday ? 700 : 500}>
                        {payload.value}
                      </text>
                      <text x={0} y={0} dy={23} textAnchor="middle" fill="#2a2a2a" fontSize={9}>
                        {d.fullDate}
                      </text>
                    </g>
                  );
                }}
                tickLine={false}
                axisLine={false}
                height={34}
              />
              <YAxis
                tick={{ fill: '#2a2a2a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${Math.floor(v / 60)}h`}
              />
              <Tooltip content={<WeekTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {weeklyData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.isToday ? '#cc2222' : d.isFuture ? '#1a1a1a' : d.minutes > 0 ? '#7a1a1a' : '#161616'}
                    opacity={d.isFuture ? 0.4 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        <ChartSection>
          <ChartHeader>
            <ChartTitle>Stunden pro Mitarbeiter</ChartTitle>
            <ChartSub style={{ textTransform: 'capitalize' }}>{currentMonth}</ChartSub>
          </ChartHeader>
          {workerData.length === 0 ? (
            <EmptyState>Keine Daten für diesen Monat</EmptyState>
          ) : workerData.length <= 5 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={workerData}
                  dataKey="minutes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {workerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => (
                    <span style={{ color: '#666', fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={workerData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#3a3a3a', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${Math.floor(v / 60)}h`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#666', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="minutes" radius={[0, 3, 3, 0]} maxBarSize={20}>
                  {workerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartSection>
      </ChartsGrid>
    </>
  );
};

export default DashboardPage;
