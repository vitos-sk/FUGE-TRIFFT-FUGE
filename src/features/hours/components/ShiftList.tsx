import React from 'react';
import type { WorkHourEntry } from '@shared/types';
import { formatHM, formatShiftCount } from '../utils/timeUtils';
import { Card, OutlineBtn } from './hoursUi.styles';
import { ShiftRow } from './ShiftRow';
import {
  Head,
  HeadTitle,
  HeadTotal,
  RefreshDot,
  List,
  SkeletonRow,
  SkeletonBar,
  Note,
  Footer,
} from './ShiftList.styles';

const PAGE_SIZE = 50;

interface Props {
  /** Shifts that match the month and filters, newest first. */
  entries: WorkHourEntry[];
  limit: number;
  onShowMore: () => void;
  totalMins: number;
  loading: boolean;
  refreshing: boolean;
  failed: boolean;
  onRetry: () => void;
  isFiltered: boolean;
  showWorker: boolean;
  uid: string | null;
  expandedId: string | null;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (entry: WorkHourEntry) => void;
}

/** Month list: header with the total, shift rows, and the loading / empty / error states. */
export const ShiftList: React.FC<Props> = ({
  entries,
  limit,
  onShowMore,
  totalMins,
  loading,
  refreshing,
  failed,
  onRetry,
  isFiltered,
  showWorker,
  uid,
  expandedId,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const shown = entries.slice(0, limit);

  const renderBody = () => {
    if (loading) {
      return (
        <List aria-busy="true">
          {[0, 1, 2].map((i) => (
            <SkeletonRow key={i}>
              <SkeletonBar $w="40px" />
              <SkeletonBar $w="120px" />
              <SkeletonBar $w="36px" />
            </SkeletonRow>
          ))}
        </List>
      );
    }
    if (entries.length === 0 && failed) {
      return (
        <Note>
          Die Stunden konnten nicht geladen werden.
          <OutlineBtn type="button" onClick={onRetry}>
            Erneut versuchen
          </OutlineBtn>
        </Note>
      );
    }
    if (entries.length === 0) {
      return (
        <Note>
          {isFiltered
            ? 'Keine Einträge für diese Filter gefunden.'
            : 'In diesem Monat gibt es noch keine Schichten.'}
        </Note>
      );
    }
    return (
      <List>
        {shown.map((e) => (
          <ShiftRow
            key={e.id}
            entry={e}
            showWorker={showWorker}
            open={expandedId === e.id}
            onToggle={() => onToggle(e.id)}
            canEdit={e.userId === uid}
            onEdit={() => onEdit(e.id)}
            onDelete={() => onDelete(e)}
          />
        ))}
      </List>
    );
  };

  return (
    <Card>
      <Head>
        <HeadTitle>Schichten im Monat</HeadTitle>
        {!loading && (
          <HeadTotal>
            {refreshing && <RefreshDot aria-label="Aktualisierung" />}
            <span>
              Gesamt: <strong>{formatHM(totalMins)} h</strong> · {formatShiftCount(entries.length)}
            </span>
          </HeadTotal>
        )}
      </Head>

      {renderBody()}

      {!loading && entries.length > limit && (
        <Footer>
          <span>
            Angezeigt {shown.length} von {entries.length}
          </span>
          <OutlineBtn type="button" onClick={onShowMore}>
            Mehr anzeigen (+{PAGE_SIZE})
          </OutlineBtn>
        </Footer>
      )}
    </Card>
  );
};
