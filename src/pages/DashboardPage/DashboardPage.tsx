import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useDashboardData } from '@features/dashboard/hooks';
import { toIso } from '@features/dashboard/utils/period';
import type { DashboardPeriod } from '@features/dashboard/utils/period';
import {
  buildKpis,
  buildObjectStats,
  buildWorkerStats,
  buildTrendSeries,
  buildHeatmap,
  buildTodaySummary,
  findAnomalies,
  buildActivityFeed,
} from '@features/dashboard/utils/aggregate';
import { OfflineBanner } from '@shared/ui/OfflineBanner';
import { useOnlineStatus } from '@shared/hooks/useOnlineStatus';
import { PeriodSwitch } from './components/PeriodSwitch';
import { KpiRow } from './components/KpiRow';
import { TodayPanel } from './components/TodayPanel';
import { HoursTrendChart } from './components/HoursTrendChart';
import { TopObjects } from './components/TopObjects';
import { WorkerTable } from './components/WorkerTable';
import { ActivityFeed } from './components/ActivityFeed';
import { WorkerHeatmap } from './components/WorkerHeatmap';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import {
  Header,
  PageTitle,
  DateTag,
  RefreshTag,
  Stack,
  SplitGrid,
  EvenGrid,
} from './DashboardPage.styles';

const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const isOnline = useOnlineStatus();

  const { curHours, prevHours, users, objects, tasks, bounds, buckets, loading, refreshing } =
    useDashboardData(period);

  const now = useMemo(() => new Date(), []);
  const today = toIso(now);

  const kpis = useMemo(
    () => buildKpis(curHours, prevHours, users),
    [curHours, prevHours, users]
  );
  const objectStats = useMemo(() => buildObjectStats(curHours), [curHours]);
  const workerStats = useMemo(
    () => buildWorkerStats(curHours, prevHours),
    [curHours, prevHours]
  );
  const trendData = useMemo(() => buildTrendSeries(curHours, buckets), [curHours, buckets]);
  const heatmap = useMemo(
    () => buildHeatmap(curHours, buckets, users),
    [curHours, buckets, users]
  );
  const todaySummary = useMemo(
    () => buildTodaySummary(curHours, users, today),
    [curHours, users, today]
  );
  const anomalies = useMemo(() => findAnomalies(curHours, today), [curHours, today]);
  const activity = useMemo(
    () => buildActivityFeed(objects, tasks, curHours),
    [objects, tasks, curHours]
  );

  if (loading && !isOnline) {
    return <OfflineBanner message="Kein Internet – Dashboard kann nicht geladen werden" />;
  }

  return (
    <>
      <Header>
        <PageTitle>Dashboard</PageTitle>
        <DateTag>{format(now, 'dd. MMMM yyyy', { locale: de })}</DateTag>
        {refreshing && !loading && <RefreshTag>wird aktualisiert …</RefreshTag>}
      </Header>

      <PeriodSwitch period={period} onChange={setPeriod} label={bounds.label} />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <Stack>
          <KpiRow kpis={kpis} prevLabel={bounds.prevLabel} />

          <TodayPanel summary={todaySummary} anomalies={anomalies} today={now} />

          <SplitGrid>
            <HoursTrendChart
              data={trendData}
              totalMinutes={kpis.totalMinutes}
              trendPct={kpis.totalTrend}
              prevLabel={bounds.prevLabel}
              periodLabel={bounds.label}
            />
            <TopObjects stats={objectStats} periodLabel={bounds.label} />
          </SplitGrid>

          <EvenGrid>
            <WorkerTable
              stats={workerStats}
              periodLabel={bounds.label}
              prevLabel={bounds.prevLabel}
            />
            <ActivityFeed items={activity} />
          </EvenGrid>

          <WorkerHeatmap data={heatmap} periodLabel={bounds.label} />
        </Stack>
      )}
    </>
  );
};

export default DashboardPage;
