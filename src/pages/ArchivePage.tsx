import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiSearch, FiRotateCcw, FiInbox } from 'react-icons/fi';
import { restoreObject } from '../services/objectsService';
import { useArchivedObjects } from '../hooks/useObjects';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import type { CRMObject } from '../types';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: 36px;
  width: 100%;
`;

const Count = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
  white-space: nowrap;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const ArchivedCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  opacity: 0.65;
  transition: opacity ${({ theme }) => theme.transitions.fast}, border-color ${({ theme }) => theme.transitions.fast};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.textMuted};
    border-radius: ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0 0;
  }

  &:hover {
    opacity: 0.9;
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const CardHeader = styled.div`
  padding: 18px 18px 0;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.3;
  flex: 1;
`;

const ArchivedBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
`;

const Location = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 18px;
`;

const CardFooter = styled.div`
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ArchivedDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const EmptyIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.3;
  display: flex;
  justify-content: center;
`;

// ─── Component ─────────────────────────────────────────────────────────────────

const ArchiveCard: React.FC<{ object: CRMObject; onRestore: (obj: CRMObject) => void; isAdmin: boolean }> = ({ object, onRestore, isAdmin }) => {
  const archivedDate = object.archivedAt?.toDate?.();

  return (
    <ArchivedCard>
      <CardHeader>
        <CardTop>
          <CardTitle>{object.title}</CardTitle>
          <ArchivedBadge>Archiviert</ArchivedBadge>
        </CardTop>
        <Location>
          <FiMapPin size={12} style={{ flexShrink: 0 }} />
          {object.address}, {object.city}
        </Location>
      </CardHeader>
      <Divider />
      <CardFooter>
        <ArchivedDate>
          {archivedDate ? format(archivedDate, 'dd. MMM yyyy', { locale: de }) : '—'}
        </ArchivedDate>
        {isAdmin && (
          <Button $variant="secondary" $size="sm" onClick={() => onRestore(object)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiRotateCcw size={13} />
            Wiederherstellen
          </Button>
        )}
      </CardFooter>
    </ArchivedCard>
  );
};

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spinner size={32} />
      </div>
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
            <ArchiveCard key={obj.id} object={obj} onRestore={handleRestore} isAdmin={isAdmin} />
          ))
        )}
      </Grid>
    </>
  );
};

export default ArchivePage;
