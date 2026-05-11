import { useEffect, useState } from 'react';
import { subscribeToObjects, subscribeToArchivedObjects } from '../services/objectsService';
import type { CRMObject } from '../types';

export const useObjects = () => {
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToObjects(
      (data) => {
        setObjects(data.filter((o) => !o.archived));
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
