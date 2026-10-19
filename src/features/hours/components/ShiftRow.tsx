import React, { useId } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiChevronDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { WorkHourEntry } from '@shared/types';
import { formatHM, parseIsoDate } from '../utils/timeUtils';
import { OutlineBtn } from './hoursUi.styles';
import { Item, Head, Day, Who, Time, Hours, Chevron, Details, Facts, Actions } from './ShiftRow.styles';

interface Props {
  entry: WorkHourEntry;
  /** Boss sees whose shift it is; a worker (or a single-person filter) sees the object. */
  showWorker: boolean;
  open: boolean;
  onToggle: () => void;
  /** Only your own entries can be changed. */
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** One shift: collapsed 40px line, opens to show object / break and the edit actions. */
export const ShiftRow: React.FC<Props> = ({
  entry,
  showWorker,
  open,
  onToggle,
  canEdit,
  onEdit,
  onDelete,
}) => {
  const detailsId = useId();
  const day = parseIsoDate(entry.date);

  return (
    <Item>
      <Head type="button" $open={open} aria-expanded={open} aria-controls={detailsId} onClick={onToggle}>
        <Day>
          <b>{format(day, 'dd')}</b> {format(day, 'EEEEEE', { locale: de })}
        </Day>
        <Who>{showWorker ? entry.userName : entry.objectTitle || '—'}</Who>
        <Time>
          {entry.startTime}–{entry.endTime}
        </Time>
        <Hours>{formatHM(entry.totalMinutes)}</Hours>
        <Chevron $open={open}>
          <FiChevronDown size={16} />
        </Chevron>
      </Head>

      {open && (
        <Details id={detailsId}>
          <Facts>
            <dt>Objekt</dt>
            <dd>{entry.objectTitle || '—'}</dd>
            {entry.breakMinutes > 0 && (
              <>
                <dt>Pause</dt>
                <dd>{formatHM(entry.breakMinutes)}</dd>
              </>
            )}
          </Facts>
          {canEdit && (
            <Actions>
              <OutlineBtn type="button" onClick={onEdit}>
                <FiEdit2 size={14} />
                Bearbeiten
              </OutlineBtn>
              <OutlineBtn type="button" $danger onClick={onDelete}>
                <FiTrash2 size={14} />
                Löschen
              </OutlineBtn>
            </Actions>
          )}
        </Details>
      )}
    </Item>
  );
};
