import React, { useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { NoteItem } from './NoteItem';
import { AddNoteForm } from './AddNoteForm';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '@features/auth/hooks';
import { Loader } from '@shared/ui/Loader';
import { formatDayHeading } from '@shared/utils/dateLabels';
import type { Note } from '@shared/types';
import {
  Wrapper,
  Feed,
  DayDivider,
  Composer,
  Empty,
  EmptyTitle,
  EmptyHint,
} from './NotesFeed.styles';

interface Props {
  objectId: string;
  objectTitle?: string;
  highlightNoteId?: string;
}

/** Oldest first, split into day groups — chat reading order */
const groupByDay = (notes: Note[]) => {
  const groups: { key: string; label: string; notes: Note[] }[] = [];
  notes.forEach((note) => {
    const date = note.createdAt?.toDate?.() ?? null;
    const key = date ? format(date, 'yyyy-MM-dd') : 'unknown';
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.notes.push(note);
      return;
    }
    groups.push({
      key,
      label: date ? formatDayHeading(date) : 'Ohne Datum',
      notes: [note],
    });
  });
  return groups;
};

export const NotesFeed: React.FC<Props> = ({ objectId, objectTitle, highlightNoteId }) => {
  const { notes, loading } = useNotes(objectId);
  const { uid, isAdmin } = useAuth();

  // useNotes delivers newest first; the chat renders oldest → newest
  const ordered = useMemo(() => [...notes].reverse(), [notes]);
  const groups = useMemo(() => groupByDay(ordered), [ordered]);

  const endRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);
  const lastCount = useRef(0);

  // Jump to the newest message once the chat is loaded, and follow along when
  // the current user sends one. A deep link to a note wins over both.
  useEffect(() => {
    if (loading || highlightNoteId || ordered.length === 0) return;

    if (!didInitialScroll.current) {
      didInitialScroll.current = true;
      lastCount.current = ordered.length;
      endRef.current?.scrollIntoView({ block: 'end' });
      return;
    }

    if (ordered.length > lastCount.current) {
      const newest = ordered[ordered.length - 1];
      if (newest.authorId === uid) {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
    lastCount.current = ordered.length;
  }, [loading, ordered, highlightNoteId, uid]);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : ordered.length === 0 ? (
        <Empty>
          <EmptyTitle>Noch keine Nachrichten</EmptyTitle>
          <EmptyHint>Schreibe die erste Nachricht zu diesem Objekt.</EmptyHint>
        </Empty>
      ) : (
        <Feed>
          {groups.map((group) => (
            <React.Fragment key={group.key}>
              <DayDivider>{group.label}</DayDivider>
              {group.notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  objectId={objectId}
                  uid={uid ?? ''}
                  isAdmin={isAdmin}
                  highlighted={note.id === highlightNoteId}
                />
              ))}
            </React.Fragment>
          ))}
          <div ref={endRef} />
        </Feed>
      )}

      <Composer>
        <AddNoteForm objectId={objectId} objectTitle={objectTitle} />
      </Composer>
    </Wrapper>
  );
};
