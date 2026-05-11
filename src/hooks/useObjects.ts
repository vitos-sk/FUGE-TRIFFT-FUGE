import { useEffect, useState } from 'react';
import { subscribeToObjects } from '../services/objectsService';
import type { CRMObject } from '../types';

export const useObjects = () => {
  const [objects, setObjects] = useState<CRMObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeToObjects(
      (data) => {
        setObjects(data);
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
