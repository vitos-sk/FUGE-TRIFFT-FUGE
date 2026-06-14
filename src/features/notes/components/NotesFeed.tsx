import React from 'react';
import { NoteItem } from './NoteItem';
import { AddNoteForm } from './AddNoteForm';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '@shared/hooks/useAuth';
import { Loader } from '@shared/ui/Loader';
import { Wrapper, Feed, Empty } from './NotesFeed.styles';

interface Props {
  objectId: string;
  objectTitle?: string;
  highlightNoteId?: string;
}

export const NotesFeed: React.FC<Props> = ({ objectId, objectTitle, highlightNoteId }) => {
  const { notes, loading } = useNotes(objectId);
  const { uid, isAdmin } = useAuth();

  return (
    <Wrapper>
      <AddNoteForm objectId={objectId} objectTitle={objectTitle} />
      {loading ? (
        <Loader />
      ) : notes.length === 0 ? (
        <Empty>Noch keine Notizen vorhanden.</Empty>
      ) : (
        <Feed>
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              objectId={objectId}
              uid={uid ?? ''}
              isAdmin={isAdmin}
              highlighted={note.id === highlightNoteId}
            />
          ))}
        </Feed>
      )}
    </Wrapper>
  );
};
