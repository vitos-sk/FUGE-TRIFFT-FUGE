import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ChartSection,
  ChartHeader,
  ChartTitle,
  ChartSubCapitalized,
  EmptyState,
  LegendLabel,
  TooltipBox,
  TooltipLabel,
  TooltipValue,
} from './WorkerChart.styles';

const COLORS = ['#cc2222', '#c9a84c', '#22a35a', '#3b82f6', '#8b5cf6', '#f97316'];

const BarTooltip = ({
  active,
  payload,
  label,
}: {
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
      <TooltipValue>
        {h}:{String(m).padStart(2, '0')} Std.
      </TooltipValue>
    </TooltipBox>
  );
};

const PieTooltip = ({
  active,
  payload,
}: {
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

interface WorkerEntry {
  name: string;
  minutes: number;
  hours: number;
}

interface WorkerChartProps {
  workerData: WorkerEntry[];
  currentMonth: string;
}

export const WorkerChart: React.FC<WorkerChartProps> = ({ workerData, currentMonth }) => (
  <ChartSection>
    <ChartHeader>
      <ChartTitle>Stunden pro Mitarbeiter</ChartTitle>
      <ChartSubCapitalized>{currentMonth}</ChartSubCapitalized>
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
            formatter={(value) => <LegendLabel>{value}</LegendLabel>}
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
          <Tooltip
            content={<BarTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="minutes" radius={[0, 3, 3, 0]} maxBarSize={20}>
            {workerData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </ChartSection>
);
