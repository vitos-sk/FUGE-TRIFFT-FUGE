import { useEffect, useRef, useState } from 'react';
import { archiveObject, restoreObject } from '@shared/services/objectsService';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import type { CRMObject } from '@shared/types';

export const useObjectCard = (object: CRMObject) => {
  const toast = useToast();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);

    const ok = await confirm({
      title: 'Objekt archivieren?',
      message: `Das Objekt „${object.title}" wird ins Archiv verschoben. Alle Daten (Stunden, Notizen, Checklisten) bleiben erhalten. Du kannst es jederzeit wiederherstellen.`,
      confirmLabel: 'Archivieren',
      cancelLabel: 'Abbrechen',
      success: true,
    });
    if (!ok) return;

    setArchiving(true);

    setTimeout(async () => {
      await archiveObject(object.id);
      toast.success('Objekt archiviert', {
        duration: 5000,
        action: {
          label: 'Rückgängig',
          onClick: async () => {
            await restoreObject(object.id);
            toast.info('Wiederhergestellt');
          },
        },
      });
    }, 450);
  };

  return { menuOpen, setMenuOpen, archiving, menuRef, handleArchive };
};
