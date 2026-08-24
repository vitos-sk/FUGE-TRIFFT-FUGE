import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendChartData, TrendRow } from '@features/dashboard/utils/aggregate';
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelSub,
  EmptyState,
  TrendBadge,
  TooltipBox,
  TooltipLabel,
  TooltipRow,
  TooltipDot,
  TooltipRowValue,
  TooltipSub,
} from './Card.styles';
import {
  HeaderInfo,
  TotalValue,
  LegendRow,
  LegendItem,
  LegendDot,
  LegendName,
} from './HoursTrendChart.styles';

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

const TrendTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ payload: TrendRow }>;
  series: TrendChartData['series'];
}> = ({ active, payload, series }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const parts = series
    .map((s) => ({ ...s, minutes: (row[s.id] as number) || 0 }))
    .filter((s) => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  return (
    <TooltipBox>
      <TooltipLabel>{row.sub}</TooltipLabel>
      {parts.length === 0 ? (
        <TooltipSub>Kein Eintrag</TooltipSub>
      ) : (
        <>
          {parts.map((s) => (
            <TooltipRow key={s.id}>
              <TooltipDot $color={s.color} />
              <LegendName>{s.name}</LegendName>
              <TooltipRowValue>{hhmm(s.minutes)}</TooltipRowValue>
            </TooltipRow>
          ))}
          <TooltipSub>Gesamt {hhmm(row.total)} Std.</TooltipSub>
        </>
      )}
    </TooltipBox>
  );
};

interface HoursTrendChartProps {
  data: TrendChartData;
  totalMinutes: number;
  trendPct: number | null;
  prevLabel: string;
  periodLabel: string;
}

export const HoursTrendChart: React.FC<HoursTrendChartProps> = ({
  data,
  totalMinutes,
  trendPct,
  prevLabel,
  periodLabel,
}) => {
  const { rows, series } = data;
  const lastId = series.length ? series[series.length - 1].id : null;

  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>Stundenverlauf</PanelTitle>
          <HeaderInfo>
            <TotalValue>{hhmm(totalMinutes)} Std.</TotalValue>
            {trendPct !== null && (
              <TrendBadge $up={trendPct >= 0}>
                {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)} % {prevLabel}
              </TrendBadge>
            )}
          </HeaderInfo>
        </div>
        <PanelSub>{periodLabel}</PanelSub>
      </PanelHeader>

      {totalMinutes === 0 ? (
        <EmptyState>Keine Stunden in diesem Zeitraum</EmptyState>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={rows} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: '#5a5a5a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                tick={{ fill: '#3a3a3a', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${Math.floor(v / 60)}h`}
              />
              <Tooltip
                content={<TrendTooltip series={series} />}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              {series.map((s) => (
                <Bar
                  key={s.id}
                  dataKey={s.id}
                  stackId="hours"
                  fill={s.color}
                  maxBarSize={44}
                  radius={s.id === lastId ? [3, 3, 0, 0] : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>

          <LegendRow>
            {series.map((s) => (
              <LegendItem key={s.id}>
                <LegendDot $color={s.color} />
                <LegendName>{s.name}</LegendName>
              </LegendItem>
            ))}
          </LegendRow>
        </>
      )}
    </Panel>
  );
};
