import React from 'react';
import type { DashboardKpis } from '@features/dashboard/utils/aggregate';
import { TrendBadge } from './Card.styles';
import {
  CardsRow,
  KpiCard,
  KpiLabel,
  KpiValue,
  KpiUnit,
  KpiFooter,
  KpiHint,
} from './KpiRow.styles';

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

const Trend: React.FC<{ pct: number | null; label: string }> = ({ pct, label }) =>
  pct === null ? (
    <KpiHint>Kein Vergleichswert</KpiHint>
  ) : (
    <>
      <TrendBadge $up={pct >= 0}>
        {pct >= 0 ? '↑' : '↓'} {Math.abs(pct)} %
      </TrendBadge>
      <KpiHint>{label}</KpiHint>
    </>
  );

interface KpiRowProps {
  kpis: DashboardKpis;
  prevLabel: string;
}

export const KpiRow: React.FC<KpiRowProps> = ({ kpis, prevLabel }) => (
  <CardsRow>
    <KpiCard>
      <KpiLabel>Stunden gesamt</KpiLabel>
      <KpiValue>
        {hhmm(kpis.totalMinutes)}
        <KpiUnit>Std.</KpiUnit>
      </KpiValue>
      <KpiFooter>
        <Trend pct={kpis.totalTrend} label={prevLabel} />
      </KpiFooter>
    </KpiCard>

    <KpiCard>
      <KpiLabel>Ø pro Arbeitstag</KpiLabel>
      <KpiValue>
        {hhmm(kpis.avgPerWorkday)}
        <KpiUnit>Std.</KpiUnit>
      </KpiValue>
      <KpiFooter>
        <Trend pct={kpis.avgTrend} label={prevLabel} />
      </KpiFooter>
    </KpiCard>

    <KpiCard>
      <KpiLabel>Aktive Mitarbeiter</KpiLabel>
      <KpiValue>
        {kpis.activeWorkers}
        <KpiUnit>von {kpis.totalWorkers}</KpiUnit>
      </KpiValue>
      <KpiFooter>
        <KpiHint>
          {kpis.workdays} {kpis.workdays === 1 ? 'Arbeitstag' : 'Arbeitstage'} erfasst
        </KpiHint>
      </KpiFooter>
    </KpiCard>

    <KpiCard>
      <KpiLabel>Objekte bearbeitet</KpiLabel>
      <KpiValue>{kpis.objectCount}</KpiValue>
      <KpiFooter>
        <Trend pct={kpis.objectTrend} label={prevLabel} />
      </KpiFooter>
    </KpiCard>
  </CardsRow>
);
