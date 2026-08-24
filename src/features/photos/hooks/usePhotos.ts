import { useEffect, useState } from 'react';
import { subscribeToPhotos } from '@features/photos/services';
import type { Photo } from '@shared/types';

/**
 * Single subscription for an object's photos. Lives on the page so the header
 * count and the grid share one Firestore listener.
 */
export const usePhotos = (objectId: string | undefined) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!objectId) return;
    const unsub = subscribeToPhotos('objects', objectId, (data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsub;
  }, [objectId]);

  return { photos, loading };
};
