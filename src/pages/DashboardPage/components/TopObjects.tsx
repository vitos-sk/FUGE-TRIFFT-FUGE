import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { ObjectStat } from '@features/dashboard/utils/aggregate';
import { SERIES_COLORS, OTHER_COLOR } from '@features/dashboard/utils/aggregate';
import { Panel, PanelHeader, PanelTitle, PanelSub, EmptyState } from './Card.styles';
import {
  List,
  Row,
  Rank,
  Main,
  Title,
  Meta,
  BarTrack,
  BarFill,
  Values,
  Hours,
  Share,
  MoreBtn,
} from './TopObjects.styles';

const VISIBLE = 6;

const hhmm = (mins: number): string =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;

const lastActivity = (iso: string): string =>
  format(new Date(iso + 'T12:00:00'), 'dd.MM.yyyy', { locale: de });

interface TopObjectsProps {
  stats: ObjectStat[];
  periodLabel: string;
}

export const TopObjects: React.FC<TopObjectsProps> = ({ stats, periodLabel }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? stats : stats.slice(0, VISIBLE);
  const max = stats.length ? stats[0].minutes : 0;

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Top-Objekte</PanelTitle>
        <PanelSub>{periodLabel}</PanelSub>
      </PanelHeader>

      {stats.length === 0 ? (
        <EmptyState>Keine Stunden in diesem Zeitraum</EmptyState>
      ) : (
        <>
          <List>
            {visible.map((o, i) => (
              <Row
                key={o.objectId ?? '__none__'}
                $clickable={Boolean(o.objectId)}
                onClick={() => o.objectId && navigate(`/objects/${o.objectId}`)}
              >
                <Rank>{i + 1}</Rank>
                <Main>
                  <Title>{o.title}</Title>
                  <Meta>
                    {o.workerCount} {o.workerCount === 1 ? 'Person' : 'Personen'} · {o.days}{' '}
                    {o.days === 1 ? 'Tag' : 'Tage'} · zuletzt {lastActivity(o.lastDate)}
                  </Meta>
                  <BarTrack>
                    <BarFill
                      $pct={max ? (o.minutes / max) * 100 : 0}
                      $color={
                        o.objectId
                          ? SERIES_COLORS[i % SERIES_COLORS.length]
                          : OTHER_COLOR
                      }
                    />
                  </BarTrack>
                </Main>
                <Values>
                  <Hours>{hhmm(o.minutes)}</Hours>
                  <Share>{o.share} %</Share>
                </Values>
              </Row>
            ))}
          </List>

          {stats.length > VISIBLE && (
            <MoreBtn type="button" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Weniger anzeigen' : `Alle ${stats.length} Objekte anzeigen`}
            </MoreBtn>
          )}
        </>
      )}
    </Panel>
  );
};
