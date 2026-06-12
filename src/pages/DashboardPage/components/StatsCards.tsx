import React from 'react';
import { CardsRow, StatCard, StatLabel, StatValue, StatUnit } from './StatsCards.styles';

interface StatsCardsProps {
  todayWorkers: number;
  weekMins: number;
  activeObjects: number;
  totalWorkers: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  todayWorkers,
  weekMins,
  activeObjects,
  totalWorkers,
}) => (
  <CardsRow>
    <StatCard>
      <StatLabel>Heute aktiv</StatLabel>
      <StatValue>
        {todayWorkers}
        <StatUnit>Pers.</StatUnit>
      </StatValue>
    </StatCard>
    <StatCard>
      <StatLabel>Stunden diese Woche</StatLabel>
      <StatValue>
        {(weekMins / 60).toFixed(1)}
        <StatUnit>Std.</StatUnit>
      </StatValue>
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
);
