import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { sortWorkerStats } from '@features/dashboard/utils/aggregate';
import type { WorkerStat, WorkerSortKey } from '@features/dashboard/utils/aggregate';
import { Panel, PanelHeader, PanelTitle, PanelSub, EmptyState, TrendBadge } from './Card.styles';
import { Table, Th, SortBtn, Tr, Td, NameCell, HoursCell } from './WorkerTable.styles';

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

const COLUMNS: {
  key: WorkerSortKey;
  label: string;
  align?: 'right';
  hideMobile?: boolean;
}[] = [
  { key: 'name', label: 'Mitarbeiter' },
  { key: 'minutes', label: 'Stunden', align: 'right' },
  { key: 'avgPerDay', label: 'Ø/Tag', align: 'right', hideMobile: true },
  { key: 'days', label: 'Tage', align: 'right' },
  { key: 'objectCount', label: 'Objekte', align: 'right', hideMobile: true },
];

interface WorkerTableProps {
  stats: WorkerStat[];
  periodLabel: string;
  prevLabel: string;
}

export const WorkerTable: React.FC<WorkerTableProps> = ({ stats, periodLabel, prevLabel }) => {
  const [sortKey, setSortKey] = useState<WorkerSortKey>('minutes');
  const [desc, setDesc] = useState(true);

  const toggle = (key: WorkerSortKey) => {
    if (key === sortKey) {
      setDesc((v) => !v);
      return;
    }
    setSortKey(key);
    setDesc(key !== 'name');
  };

  const rows = sortWorkerStats(stats, sortKey, desc);

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Stunden pro Mitarbeiter</PanelTitle>
        <PanelSub>{periodLabel}</PanelSub>
      </PanelHeader>

      {stats.length === 0 ? (
        <EmptyState>Keine Stunden in diesem Zeitraum</EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <Th key={c.key} $align={c.align} $hideMobile={c.hideMobile}>
                  <SortBtn
                    type="button"
                    $active={sortKey === c.key}
                    onClick={() => toggle(c.key)}
                  >
                    {c.label}
                    {sortKey === c.key && desc ? (
                      <FiChevronDown size={11} />
                    ) : (
                      <FiChevronUp size={11} />
                    )}
                  </SortBtn>
                </Th>
              ))}
              <Th $align="right">{prevLabel}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <Tr key={w.userId}>
                <NameCell>{w.name}</NameCell>
                <HoursCell $align="right">{hhmm(w.minutes)}</HoursCell>
                <Td $align="right" $hideMobile>
                  {hhmm(w.avgPerDay)}
                </Td>
                <Td $align="right">{w.days}</Td>
                <Td $align="right" $hideMobile>
                  {w.objectCount}
                </Td>
                <Td $align="right">
                  {w.trendPct === null ? (
                    '—'
                  ) : (
                    <TrendBadge $up={w.trendPct >= 0}>
                      {w.trendPct >= 0 ? '↑' : '↓'} {Math.abs(w.trendPct)} %
                    </TrendBadge>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Panel>
  );
};
