import { useEffect, useRef, useState } from 'react';
import { archiveObject, restoreObject, deleteObjectPermanently } from '@features/objects/services';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import type { CRMObject } from '@shared/types';

export const useObjectCard = (object: CRMObject) => {
  const toast = useToast();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside: close if click lands outside both the trigger button and the portal dropdown
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  // Close on scroll or window resize to avoid stale position
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menuOpen]);

  const openMenu = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setMenuOpen((v) => !v);
  };

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);

    const ok = await confirm({
      title: 'Objekt löschen?',
      message: `„${object.title}" wird dauerhaft gelöscht. Alle Notizen, Fotos und Stunden gehen verloren. Dieser Vorgang kann nicht rückgängig gemacht werden.`,
      confirmLabel: 'Löschen',
      cancelLabel: 'Abbrechen',
    });
    if (!ok) return;

    await deleteObjectPermanently(object.id);
    toast.success('Objekt gelöscht');
  };

  return {
    menuOpen,
    dropdownPos,
    dropdownRef,
    btnRef,
    archiving,
    openMenu,
    handleArchive,
    handleDelete,
  };
};
