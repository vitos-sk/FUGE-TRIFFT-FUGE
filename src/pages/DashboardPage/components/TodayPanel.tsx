import React, { useState } from 'react';
import { FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { TodaySummary, Anomaly, AnomalyType } from '@features/dashboard/utils/aggregate';
import { Panel, PanelHeader, PanelTitle, PanelSub } from './Card.styles';
import {
  TodayGrid,
  Headline,
  HeadlineValue,
  HeadlineSub,
  TodayTotal,
  ChipGroup,
  GroupLabel,
  Chip,
  ChipHours,
  ChipRow,
  AllDone,
  WarnToggle,
  WarnCount,
  WarnList,
  WarnItem,
  WarnKind,
  WarnWho,
  WarnDetail,
  WarnDate,
} from './TodayPanel.styles';

const ANOMALY_LABEL: Record<AnomalyType, string> = {
  long_shift: 'Lange Schicht',
  overlap: 'Überlappung',
  no_break: 'Ohne Pause',
};

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

const shortDate = (iso: string): string =>
  format(new Date(iso + 'T12:00:00'), 'EEEEEE dd.MM.', { locale: de });

interface TodayPanelProps {
  summary: TodaySummary;
  anomalies: Anomaly[];
  today: Date;
}

export const TodayPanel: React.FC<TodayPanelProps> = ({ summary, anomalies, today }) => {
  const [open, setOpen] = useState(false);
  const totalKnown = summary.active.length + summary.missing.length;

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Heute</PanelTitle>
        <PanelSub>{format(today, 'EEEE, dd. MMMM', { locale: de })}</PanelSub>
      </PanelHeader>

      <TodayGrid>
        <div>
          <Headline>
            <HeadlineValue>{summary.active.length}</HeadlineValue>
            <HeadlineSub>von {totalKnown} aktiv</HeadlineSub>
          </Headline>
          <TodayTotal>{hhmm(summary.totalMinutes)} Std. erfasst</TodayTotal>
        </div>

        <div>
          {summary.active.length > 0 && (
            <ChipRow>
              <ChipGroup>
                <GroupLabel>Erfasst</GroupLabel>
                {summary.active.map((a) => (
                  <Chip key={a.userId}>
                    {a.name}
                    <ChipHours>{hhmm(a.minutes)}</ChipHours>
                  </Chip>
                ))}
              </ChipGroup>
            </ChipRow>
          )}

          <ChipRow>
            {summary.missing.length > 0 ? (
              <ChipGroup>
                <GroupLabel>Offen</GroupLabel>
                {summary.missing.map((u) => (
                  <Chip key={u.uid} $muted>
                    {u.name}
                  </Chip>
                ))}
              </ChipGroup>
            ) : (
              <AllDone>
                {summary.active.length > 0
                  ? 'Alle Mitarbeiter haben ihre Stunden erfasst.'
                  : 'Heute wurden noch keine Stunden erfasst.'}
              </AllDone>
            )}
          </ChipRow>
        </div>
      </TodayGrid>

      {anomalies.length > 0 && (
        <>
          <WarnToggle type="button" onClick={() => setOpen((v) => !v)}>
            <FiAlertTriangle size={13} />
            Auffällige Einträge (letzte 7 Tage)
            <WarnCount>{anomalies.length}</WarnCount>
            {open ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
          </WarnToggle>

          {open && (
            <WarnList>
              {anomalies.map((a) => (
                <WarnItem key={a.id}>
                  <WarnKind>{ANOMALY_LABEL[a.type]}</WarnKind>
                  <WarnWho>{a.userName}</WarnWho>
                  <WarnDetail>{a.detail}</WarnDetail>
                  <WarnDate>{shortDate(a.date)}</WarnDate>
                </WarnItem>
              ))}
            </WarnList>
          )}
        </>
      )}
    </Panel>
  );
};
