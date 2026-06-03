import { useEffect, useState } from 'react';
import { subscribeToObjects, subscribeToArchivedObjects } from '@shared/services/objectsService';
import type { CRMObject } from '@shared/types';

export const useObjects = () => {
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToObjects(
      (data) => {
        const active = data.filter((o) => !o.archived);
        active.sort((a, b) => {
          const ta = (a.lastActivityAt ?? a.lastNoteAt ?? a.createdAt)?.toDate?.()?.getTime() ?? 0;
          const tb = (b.lastActivityAt ?? b.lastNoteAt ?? b.createdAt)?.toDate?.()?.getTime() ?? 0;
          return tb - ta;
        });
        setObjects(active);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { objects, loading, error };
};

export const useArchivedObjects = () => {
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToArchivedObjects(
      (data) => { setObjects(data); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { objects, loading };
};

export const useArchivedCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToArchivedObjects((data) => setCount(data.length));
    return unsub;
  }, []);

  return count;
};
