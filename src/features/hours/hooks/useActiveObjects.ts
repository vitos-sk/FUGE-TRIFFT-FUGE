import { useState, useEffect } from 'react';
import { subscribeToObjects } from '@features/objects/services';
import type { CRMObject } from '@shared/types';

/** Non-archived objects, most recently active first. */
export const useActiveObjects = (): CRMObject[] => {
  const [objects, setObjects] = useState<CRMObject[]>([]);

  useEffect(() => {
    const unsub = subscribeToObjects((data) => {
      const active = data.filter((o) => !o.archived);
      active.sort((a, b) => {
        const ta = (a.lastActivityAt ?? a.lastNoteAt ?? a.createdAt)?.toDate?.()?.getTime() ?? 0;
        const tb = (b.lastActivityAt ?? b.lastNoteAt ?? b.createdAt)?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setObjects(active);
    });
    return unsub;
  }, []);

  return objects;
};
