import React, { useState } from "react";
import styled from "styled-components";
import { useObjects } from "@features/objects/hooks/useObjects";
import { useAuth } from "@shared/hooks/useAuth";
import { FiPlus } from "react-icons/fi";
import { ObjectCard } from "@features/objects/components/ObjectCard";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Modal } from "@shared/ui/Modal";
import { Spinner } from "@shared/ui/Spinner";
import { createObject } from "@shared/services/objectsService";
import type { CRMObject, ObjectStatus } from "@shared/types";

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
    &::-webkit-scrollbar {
      display: none;
    }
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
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.textMuted)};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.textSecondary)};
    background: ${({ $active, theme }) =>
      $active ? theme.colors.accent : "rgba(255,255,255,0.05)"};
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

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  letter-spacing: 0.04em;

  &::before {
    content: "—";
    display: block;
    font-size: 28px;
    margin-bottom: 14px;
    color: ${({ theme }) => theme.colors.border};
  }
`;

const FAB = styled.button`
  position: fixed;
  bottom: 24px;
  right: 22px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(204, 34, 34, 0.75);
  border: 1px solid rgba(204, 34, 34, 0.4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(204, 34, 34, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.4);
  transition: all ${({ theme }) => theme.transitions.spring};
  z-index: 100;

  &:hover {
    transform: scale(1.08);
    background: rgba(204, 34, 34, 0.9);
    box-shadow:
      0 6px 22px rgba(204, 34, 34, 0.35),
      0 2px 8px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 768px) {
    bottom: 76px;
    width: 38px;
    height: 38px;
  }
`;

const FILTERS: { label: string; value: ObjectStatus | "all" }[] = [
  { label: "Alle", value: "all" },
  { label: "Neu", value: "new" },
  { label: "In Arbeit", value: "in_progress" },
  { label: "Pausiert", value: "paused" },
  { label: "Fertig", value: "done" },
];

const BoardPage: React.FC = () => {
  const { objects, loading } = useObjects();
  const { isAdmin, uid } = useAuth();
  const [filter, setFilter] = useState<ObjectStatus | "all">("all");
  const [showModal, setShowModal] = useState(false);

  const filtered =
    filter === "all" ? objects : objects.filter((o) => o.status === filter);

  const handleCreate = async (data: Partial<CRMObject>) => {
    if (!uid) return;
    await createObject(
      data as Omit<CRMObject, "id" | "createdAt" | "materials" | "checklist">,
      uid,
    );
    setShowModal(false);
  };

  return (
    <>
      <Header>
        <PageTitle>Objekte — {objects.length}</PageTitle>
        <FilterBar>
          {FILTERS.map((f) => {
            const count =
              f.value === "all"
                ? objects.length
                : objects.filter((o) => o.status === f.value).length;
            return (
              <FilterBtn
                key={f.value}
                $active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                {count > 0 && <CountBadge>{count}</CountBadge>}
              </FilterBtn>
            );
          })}
        </FilterBar>
      </Header>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Spinner size={28} />
        </div>
      ) : (
        <Grid>
          {filtered.length === 0 ? (
            <Empty>Keine Objekte gefunden</Empty>
          ) : (
            filtered.map((obj) => <ObjectCard key={obj.id} object={obj} />)
          )}
        </Grid>
      )}

      {isAdmin && (
        <>
          <FAB onClick={() => setShowModal(true)} title="Neues Objekt">
            <FiPlus size={18} />
          </FAB>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Neues Objekt anlegen"
          >
            <ObjectForm
              onSubmit={handleCreate}
              onCancel={() => setShowModal(false)}
              submitLabel="Anlegen"
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default BoardPage;
