import React from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subDays,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { useObjects } from '@features/objects/hooks/useObjects';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useDashboardData } from '@shared/hooks/useDashboardData';
import { Spinner } from '@shared/ui/Spinner';
import { OfflineBanner } from '@shared/ui/OfflineBanner';
import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';
import { ROLE, OBJECT_STATUS } from '../../constants';
import { StatsCards } from './components/StatsCards';
import { WeekChart } from './components/WeekChart';
import { WorkerChart } from './components/WorkerChart';
import { Header, PageTitle, DateTag, ChartsGrid, LoadingWrapper } from './DashboardPage.styles';

const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { objects } = useObjects();
  const { hours, users, loading } = useDashboardData();
  const isOnline = useOnlineStatus();

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  if (loading) {
    if (!isOnline) {
      return (
        <OfflineBanner message="Kein Internet – Dashboard kann nicht geladen werden" />
      );
    }
    return (
      <LoadingWrapper>
        <Spinner size={32} />
      </LoadingWrapper>
    );
  }

  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(now, { locale: de }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { locale: de }), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const currentMonth = format(now, 'MMMM yyyy', { locale: de });

  const todayWorkers = new Set(hours.filter((e) => e.date === today).map((e) => e.userId)).size;
  const weekMins = hours
    .filter((e) => e.date >= weekStart && e.date <= weekEnd)
    .reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const activeObjects = objects.filter(
    (o) => o.status === OBJECT_STATUS.NEW || o.status === OBJECT_STATUS.IN_PROGRESS,
  ).length;
  const totalWorkers = users.filter((u) => u.role === ROLE.WORKER).length;

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

      <StatsCards
        todayWorkers={todayWorkers}
        weekMins={weekMins}
        activeObjects={activeObjects}
        totalWorkers={totalWorkers}
      />

      <ChartsGrid>
        <WeekChart
          weeklyData={weeklyData}
          thisWeekMins={thisWeekMins}
          lastWeekMins={lastWeekMins}
          weekDiffMins={weekDiffMins}
          weekDiffH={weekDiffH}
          weekDiffM={weekDiffM}
          now={now}
        />
        <WorkerChart workerData={workerData} currentMonth={currentMonth} />
      </ChartsGrid>
    </>
  );
};

export default DashboardPage;
