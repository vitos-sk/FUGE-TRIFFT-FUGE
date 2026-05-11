import React, { useState } from 'react';
import styled from 'styled-components';
import { useObjects } from '../hooks/useObjects';
import { useAuth } from '../hooks/useAuth';
import { ObjectCard } from '../components/objects/ObjectCard';
import { ObjectForm } from '../components/objects/ObjectForm';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { createObject } from '../services/objectsService';
import type { CRMObject, ObjectStatus } from '../types';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 3px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 4px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.textSecondary};
    background: ${({ $active, theme }) => $active ? theme.colors.accent : 'rgba(255,255,255,0.05)'};
  }

  @media (max-width: 768px) {
    padding: 5px 11px;
    font-size: 9px;
  }
`;

const CountBadge = styled.span`
  opacity: 0.65;
  margin-left: 4px;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  letter-spacing: 0.04em;

  &::before {
    content: '—';
    display: block;
    font-size: 28px;
    margin-bottom: 14px;
    color: ${({ theme }) => theme.colors.border};
  }
`;

const FAB = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 13px 22px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(204,34,34,0.45), 0 2px 8px rgba(0,0,0,0.3);
  transition: all ${({ theme }) => theme.transitions.spring};
  z-index: 100;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(204,34,34,0.5), 0 2px 8px rgba(0,0,0,0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) { bottom: 78px; }
`;

const FILTERS: { label: string; value: ObjectStatus | 'all' }[] = [
  { label: 'Alle',      value: 'all' },
  { label: 'Neu',       value: 'new' },
  { label: 'In Arbeit', value: 'in_progress' },
  { label: 'Pausiert',  value: 'paused' },
  { label: 'Fertig',    value: 'done' },
];

const BoardPage: React.FC = () => {
  const { objects, loading } = useObjects();
  const { isAdmin, uid } = useAuth();
  const [filter, setFilter] = useState<ObjectStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'all' ? objects : objects.filter((o) => o.status === filter);

  const handleCreate = async (data: Partial<CRMObject>) => {
    if (!uid) return;
    await createObject(data as Omit<CRMObject, 'id' | 'createdAt' | 'materials' | 'checklist'>, uid);
    setShowModal(false);
  };

  return (
    <>
      <Header>
        <PageTitle>Objekte — {objects.length}</PageTitle>
        <FilterBar>
          {FILTERS.map((f) => {
            const count = f.value === 'all' ? objects.length : objects.filter((o) => o.status === f.value).length;
            return (
              <FilterBtn key={f.value} $active={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
                {count > 0 && <CountBadge>{count}</CountBadge>}
              </FilterBtn>
            );
          })}
        </FilterBar>
      </Header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spinner size={28} />
        </div>
      ) : (
        <Grid>
          {filtered.length === 0
            ? <Empty>Keine Objekte gefunden</Empty>
            : filtered.map((obj) => <ObjectCard key={obj.id} object={obj} />)
          }
        </Grid>
      )}

      {isAdmin && (
        <>
          <FAB onClick={() => setShowModal(true)}>+ Neues Objekt</FAB>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Neues Objekt anlegen">
            <ObjectForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} submitLabel="Anlegen" />
          </Modal>
        </>
      )}
    </>
  );
};

export default BoardPage;
