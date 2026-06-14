import React, { useState } from "react";
import { useObjects } from "@features/objects/hooks/useObjects";
import { useAuth } from "@shared/hooks/useAuth";
import { FiPlus } from "react-icons/fi";
import { ObjectCard } from "@features/objects/components/ObjectCard";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Modal } from "@shared/ui/Modal";
import { OfflineBanner } from "@shared/ui/OfflineBanner";
import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";
import { createObject } from "@shared/services/objectsService";
import type { CRMObject } from "@shared/types";
import { Header, PageTitle, Grid, Empty, FAB } from "./BoardPage.styles";

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

      {!isOnline && objects.length === 0 && (
        <OfflineBanner message="Kein Internet – Objekte können nicht geladen werden" />
      )}
      <Grid>
        {objects.length === 0 && !loading ? (
          <Empty>Keine Objekte gefunden</Empty>
        ) : (
          objects.map((obj) => <ObjectCard key={obj.id} object={obj} />)
        )}
      </Grid>

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
