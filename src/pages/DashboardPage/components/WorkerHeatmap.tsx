import React from 'react';
import type { HeatmapData } from '@features/dashboard/utils/aggregate';
import { Panel, PanelHeader, PanelTitle, PanelSub, EmptyState } from './Card.styles';
import {
  Scroller,
  Grid,
  CornerCell,
  ColLabel,
  RowLabel,
  Cell,
  Legend,
  LegendCell,
} from './WorkerHeatmap.styles';

const LEVELS = [0, 1, 2, 3, 4];

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

/** 0 = keine Stunden, 1–4 = Intensität relativ zum Maximum des Zeitraums. */
const levelOf = (minutes: number, max: number): number => {
  if (!minutes || !max) return 0;
  return Math.min(4, Math.ceil((minutes / max) * 4));
};

interface WorkerHeatmapProps {
  data: HeatmapData;
  periodLabel: string;
}

export const WorkerHeatmap: React.FC<WorkerHeatmapProps> = ({ data, periodLabel }) => {
  const { columns, rows, max } = data;

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Aktivität pro Mitarbeiter</PanelTitle>
        <PanelSub>{periodLabel}</PanelSub>
      </PanelHeader>

      {rows.length === 0 ? (
        <EmptyState>Keine Mitarbeiterdaten in diesem Zeitraum</EmptyState>
      ) : (
        <>
          <Scroller>
            <Grid $cols={columns.length}>
              <CornerCell />
              {columns.map((c) => (
                <ColLabel key={c.key} $current={c.isCurrent} title={c.sub}>
                  {c.label}
                </ColLabel>
              ))}

              {rows.map((row) => (
                <React.Fragment key={row.userId}>
                  <RowLabel title={`${row.name} · ${hhmm(row.total)} Std.`}>
                    {row.name}
                  </RowLabel>
                  {row.cells.map((minutes, i) => (
                    <Cell
                      key={columns[i].key}
                      $level={levelOf(minutes, max)}
                      $future={columns[i].isFuture}
                      title={`${row.name} · ${columns[i].sub} · ${
                        minutes ? `${hhmm(minutes)} Std.` : 'kein Eintrag'
                      }`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          </Scroller>

          <Legend>
            weniger
            {LEVELS.map((l) => (
              <LegendCell key={l} $level={l} />
            ))}
            mehr
          </Legend>
        </>
      )}
    </Panel>
  );
};
