import React, { useState } from "react";
import styled from "styled-components";
import { useObjects } from "@features/objects/hooks/useObjects";
import { useAuth } from "@shared/hooks/useAuth";
import { FiPlus } from "react-icons/fi";
import { ObjectCard } from "@features/objects/components/ObjectCard";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Modal } from "@shared/ui/Modal";
import { Spinner } from "@shared/ui/Spinner";
import { OfflineBanner } from "@shared/ui/OfflineBanner";
import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";
import { createObject } from "@shared/services/objectsService";
import type { CRMObject } from "@shared/types";

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

const BoardPage: React.FC = () => {
  const { objects, loading } = useObjects();
  const { isAdmin, uid } = useAuth();
  const isOnline = useOnlineStatus();
  const [showModal, setShowModal] = useState(false);

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
      </Header>

      {!isOnline && !loading && objects.length === 0 && (
        <OfflineBanner message="Kein Internet – Objekte können nicht geladen werden" />
      )}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <Spinner size={28} />
        </div>
      ) : (
        <Grid>
          {objects.length === 0 ? (
            <Empty>Keine Objekte gefunden</Empty>
          ) : (
            objects.map((obj) => <ObjectCard key={obj.id} object={obj} />)
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
