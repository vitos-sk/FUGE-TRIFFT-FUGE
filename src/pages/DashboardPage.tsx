import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { subDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { db } from '../services/firebase';
import { getAllUsers } from '../services/authService';
import { useObjects } from '../hooks/useObjects';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/ui/Spinner';
import type { WorkHourEntry, AppUser } from '../types';

// ─── Styled ────────────────────────────────────────────────────────────────────

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr 1fr; }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px 22px;
`;

const StatLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 10px;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  line-height: 1;
`;

const StatUnit = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 5px;
`;

const ChartSection = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 24px;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const COLORS = ['#cc2222', '#c9a84c', '#22a35a', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const mins = payload[0].value;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (
    <div style={{
      background: '#1e1e1e',
      border: '1px solid #252525',
      borderRadius: 6,
      padding: '8px 12px',
      fontSize: 12,
      color: '#fff',
    }}>
      <div style={{ color: '#888', marginBottom: 3 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{h}:{String(m).padStart(2, '0')} Std.</div>
    </div>
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
    const q = query(collection(db, 'workHours'));
    const unsub = onSnapshot(q, (snap) => {
      const entries = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkHourEntry));
      setHours(entries);
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

  const today = format(new Date(), 'yyyy-MM-dd');
  const now = new Date();
  const weekStart = startOfWeek(now, { locale: de });
  const weekEnd = endOfWeek(now, { locale: de });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthStartStr = format(monthStart, 'yyyy-MM-dd');
  const monthEndStr = format(monthEnd, 'yyyy-MM-dd');

  const todayWorkers = new Set(
    hours.filter((e) => e.date === today).map((e) => e.userId)
  ).size;

  const weekMins = hours
    .filter((e) => e.date >= weekStartStr && e.date <= weekEndStr)
    .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const weekHours = (weekMins / 60).toFixed(1);

  const activeObjects = objects.filter((o) => o.status === 'new' || o.status === 'in_progress').length;
  const totalWorkers = users.filter((u) => u.role === 'worker').length;

  // Bar chart: hours per day, last 30 days
  const last30Days = eachDayOfInterval({ start: subDays(now, 29), end: now });
  const dailyData = last30Days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const mins = hours
      .filter((e) => e.date === dayStr)
      .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
    return {
      day: format(day, 'dd.MM'),
      minutes: mins,
    };
  });

  // Bar/Pie chart: hours per worker this month
  const monthHours = hours.filter((e) => e.date >= monthStartStr && e.date <= monthEndStr);
  const workerMap: Record<string, { name: string; minutes: number }> = {};
  monthHours.forEach((e) => {
    if (!workerMap[e.userId]) {
      workerMap[e.userId] = { name: e.userName, minutes: 0 };
    }
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
      <PageTitle>Dashboard</PageTitle>

      <CardsRow>
        <StatCard>
          <StatLabel>Heute aktiv</StatLabel>
          <StatValue>{todayWorkers}<StatUnit>Pers.</StatUnit></StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Stunden diese Woche</StatLabel>
          <StatValue>{weekHours}<StatUnit>Std.</StatUnit></StatValue>
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
          <ChartTitle>Stunden pro Tag – letzte 30 Tage</ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#444', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: '#444', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${Math.floor(v / 60)}h`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="minutes" fill="#cc2222" radius={[3, 3, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        <ChartSection>
          <ChartTitle>Stunden pro Mitarbeiter – aktueller Monat</ChartTitle>
          {workerData.length === 0 ? (
            <p style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
              Keine Daten für diesen Monat
            </p>
          ) : workerData.length <= 4 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={workerData}
                  dataKey="minutes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => {
                    const mins = typeof value === 'number' ? value : 0;
                    return `${name} ${(mins / 60).toFixed(1)}h`;
                  }}
                  labelLine={false}
                >
                  {workerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const mins = typeof value === 'number' ? value : 0;
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    return [`${h}:${String(m).padStart(2, '0')} Std.`, 'Stunden'];
                  }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#8a8a8a', fontSize: 11 }}>{value}</span>}
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
                  tick={{ fill: '#444', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${Math.floor(v / 60)}h`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#8a8a8a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
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
