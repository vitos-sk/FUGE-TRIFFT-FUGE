import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  ChartSection,
  ChartHeader,
  ChartTitle,
  ChartSub,
  WeekSummaryRow,
  WeekTotal,
  TrendBadge,
  TooltipBox,
  TooltipLabel,
  TooltipValue,
  TooltipValueEmpty,
  TooltipSub,
} from './WeekChart.styles';

const WeekTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { day: string; fullDate: string; minutes: number; workers: number };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const { day, fullDate, minutes, workers } = payload[0].payload;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return (
    <TooltipBox>
      <TooltipLabel>
        {day}, {fullDate}
      </TooltipLabel>
      {minutes > 0 ? (
        <>
          <TooltipValue>
            {h}:{String(m).padStart(2, '0')} Std.
          </TooltipValue>
          {workers > 0 && (
            <TooltipSub>
              {workers} {workers === 1 ? 'Person' : 'Personen'} aktiv
            </TooltipSub>
          )}
        </>
      ) : (
        <TooltipValueEmpty>Kein Eintrag</TooltipValueEmpty>
      )}
    </TooltipBox>
  );
};

interface WeekDay {
  day: string;
  fullDate: string;
  minutes: number;
  workers: number;
  isToday: boolean;
  isFuture: boolean;
}

interface WeekChartProps {
  weeklyData: WeekDay[];
  thisWeekMins: number;
  lastWeekMins: number;
  weekDiffMins: number;
  weekDiffH: number;
  weekDiffM: number;
  now: Date;
}

export const WeekChart: React.FC<WeekChartProps> = ({
  weeklyData,
  thisWeekMins,
  lastWeekMins,
  weekDiffMins,
  weekDiffH,
  weekDiffM,
  now,
}) => (
  <ChartSection>
    <ChartHeader>
      <div>
        <ChartTitle>Diese Woche</ChartTitle>
        <WeekSummaryRow>
          <WeekTotal>
            {Math.floor(thisWeekMins / 60)}:
            {String(thisWeekMins % 60).padStart(2, '0')} Std.
          </WeekTotal>
          {lastWeekMins > 0 && (
            <TrendBadge $up={weekDiffMins >= 0}>
              {weekDiffMins >= 0 ? '↑' : '↓'} {weekDiffH}:
              {String(weekDiffM).padStart(2, '0')}h vs. VW
            </TrendBadge>
          )}
        </WeekSummaryRow>
      </div>
      <ChartSub>{format(now, "'KW' w", { locale: de })}</ChartSub>
    </ChartHeader>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={weeklyData}
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
      >
        <XAxis
          dataKey="day"
          tick={({ x, y, payload, index }) => {
            const d = weeklyData[index];
            return (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={12}
                  textAnchor="middle"
                  fill={d.isToday ? '#cc2222' : '#3a3a3a'}
                  fontSize={11}
                  fontWeight={d.isToday ? 700 : 500}
                >
                  {payload.value}
                </text>
                <text
                  x={0}
                  y={0}
                  dy={23}
                  textAnchor="middle"
                  fill="#2a2a2a"
                  fontSize={9}
                >
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
        <Tooltip
          content={<WeekTooltip />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {weeklyData.map((d, i) => (
            <Cell
              key={i}
              fill={
                d.isToday
                  ? '#cc2222'
                  : d.isFuture
                    ? '#1a1a1a'
                    : d.minutes > 0
                      ? '#7a1a1a'
                      : '#161616'
              }
              opacity={d.isFuture ? 0.4 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartSection>
);
