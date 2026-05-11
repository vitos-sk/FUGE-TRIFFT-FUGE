import { useEffect, useState } from 'react';
import { subscribeToNotes } from '../services/notesService';
import type { Note } from '../types';

export const useNotes = (objectId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!objectId) return;
    const unsub = subscribeToNotes(objectId, (data) => {
      setNotes(data);
      setLoading(false);
    });
    return unsub;
  }, [objectId]);

  return { notes, loading };
};
