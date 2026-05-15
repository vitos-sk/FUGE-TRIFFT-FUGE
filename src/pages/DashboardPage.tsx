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

  // Bar chart: last 30 days
  const dailyData = eachDayOfInterval({ start: subDays(now, 29), end: now }).map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const mins = hours
      .filter((e) => e.date === dayStr)
      .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
    return { day: format(day, 'dd.MM'), minutes: mins };
  });

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
            <ChartTitle>Stunden pro Tag</ChartTitle>
            <ChartSub>Letzte 30 Tage</ChartSub>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#3a3a3a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#3a3a3a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${Math.floor(v / 60)}h`}
              />
              <Tooltip
                content={<BarTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="minutes" fill="#cc2222" radius={[3, 3, 0, 0]} maxBarSize={28} />
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
