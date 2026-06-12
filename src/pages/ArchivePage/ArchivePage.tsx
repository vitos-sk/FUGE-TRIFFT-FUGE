import React, { useState } from 'react';
import { FiSearch, FiInbox } from 'react-icons/fi';
import { restoreObject, deleteObjectPermanently } from '@shared/services/objectsService';
import { useArchivedObjects } from '@features/objects/hooks/useObjects';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { Spinner } from '@shared/ui/Spinner';
import { useAuth } from '@shared/hooks/useAuth';
import type { CRMObject } from '@shared/types';
import { ArchiveCard } from './components/ArchiveCard';
import {
  PageTitle,
  Toolbar,
  SearchWrapper,
  SearchIcon,
  SearchInput,
  Count,
  Grid,
  Empty,
  EmptyIcon,
  LoadingWrapper,
} from './ArchivePage.styles';

const ArchivePage: React.FC = () => {
  const { objects, loading } = useArchivedObjects();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');

  const filtered = objects.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.address.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
  });

  const handleRestore = async (obj: CRMObject) => {
    const ok = await confirm({
      title: 'Objekt wiederherstellen?',
      message: `„${obj.title}" wird zurück auf die Haupttafel verschoben.`,
      confirmLabel: 'Wiederherstellen',
    });
    if (!ok) return;
    await restoreObject(obj.id);
    toast.success(`„${obj.title}" wiederhergestellt`);
  };

  const handleDelete = async (obj: CRMObject) => {
    const ok = await confirm({
      title: 'Objekt endgültig löschen?',
      message: `„${obj.title}" wird mit allen Notizen und Fotos dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: 'Endgültig löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteObjectPermanently(obj.id);
      toast.success(`„${obj.title}" gelöscht`);
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner size={32} />
      </LoadingWrapper>
    );
  }

  return (
    <>
      <PageTitle>Archiv — {objects.length}</PageTitle>

      <Toolbar>
        <SearchWrapper>
          <SearchIcon><FiSearch size={14} /></SearchIcon>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Name oder Adresse…"
          />
        </SearchWrapper>
        {search && (
          <Count>{filtered.length} von {objects.length}</Count>
        )}
      </Toolbar>

      <Grid>
        {filtered.length === 0 ? (
          <Empty>
            <EmptyIcon><FiInbox size={48} /></EmptyIcon>
            {search ? 'Keine Ergebnisse für diese Suche.' : 'Das Archiv ist leer.'}
          </Empty>
        ) : (
          filtered.map((obj) => (
            <ArchiveCard key={obj.id} object={obj} onRestore={handleRestore} onDelete={handleDelete} isAdmin={isAdmin} />
          ))
        )}
      </Grid>
    </>
  );
};

export default ArchivePage;
