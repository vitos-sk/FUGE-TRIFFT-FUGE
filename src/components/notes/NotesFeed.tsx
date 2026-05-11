import React from 'react';
import styled from 'styled-components';
import { NoteItem } from './NoteItem';
import { AddNoteForm } from './AddNoteForm';
import { useNotes } from '../../hooks/useNotes';
import { Spinner } from '../ui/Spinner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding: 32px 0;
`;

interface Props {
  objectId: string;
  objectTitle?: string;
}

export const NotesFeed: React.FC<Props> = ({ objectId, objectTitle }) => {
  const { notes, loading } = useNotes(objectId);

  return (
    <Wrapper>
      <AddNoteForm objectId={objectId} objectTitle={objectTitle} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <Spinner />
        </div>
      ) : notes.length === 0 ? (
        <Empty>Noch keine Notizen vorhanden.</Empty>
      ) : (
        <Feed>
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </Feed>
      )}
    </Wrapper>
  );
};
