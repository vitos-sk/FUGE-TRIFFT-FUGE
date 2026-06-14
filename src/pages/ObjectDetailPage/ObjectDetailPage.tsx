import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FiCamera, FiMessageSquare, FiCheckSquare, FiInfo } from "react-icons/fi";
import { Tabs } from "@shared/ui/Tabs";
import { NotesFeed } from "@features/notes/components/NotesFeed";
import { PhotoGrid } from "@features/photos/components/PhotoGrid";
import { Modal } from "@shared/ui/Modal";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Loader } from "@shared/ui/Loader";
import { useAuth } from "@shared/hooks/useAuth";
import { useObjectDetail } from "@features/objects/hooks/useObjectDetail";
import type { TabId } from "@shared/types";
import { ObjectHeader } from "./components/ObjectHeader";
import { ChecklistTab } from "./components/ChecklistTab";
import { InfoTab } from "./components/InfoTab";
import { TabContent, NotFoundText } from "./ObjectDetailPage.styles";

const TABS = [
  { id: "photos", label: "Fotos", icon: <FiCamera size={13} /> },
  { id: "notes", label: "Notizen", icon: <FiMessageSquare size={13} /> },
  { id: "checklist", label: "Checkliste", icon: <FiCheckSquare size={13} /> },
  { id: "info", label: "Info", icon: <FiInfo size={13} /> },
];

const statusLabels: Record<string, string> = {
  new: "Neu",
  in_progress: "In Arbeit",
  paused: "Pausiert",
  done: "Fertig",
};

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const photoParam = searchParams.get("photo");
  const noteParam = searchParams.get("note");
  const tabParam = searchParams.get("tab") as TabId | null;
  const { isAdmin } = useAuth();

  const {
    object,
    loading,
    tab,
    setTab,
    showEditModal,
    setShowEditModal,
    newCheckItem,
    setNewCheckItem,
    handleUpdate,
    handleDelete,
    addCheckItem,
    toggleCheck,
    removeCheckItem,
    doneCount,
    checklistPct,
  } = useObjectDetail(id, () => navigate("/"));

  useEffect(() => {
    if (photoParam) setTab("photos");
    else if (noteParam) setTab("notes");
    else if (tabParam) setTab(tabParam);
  }, [photoParam, noteParam, tabParam]);

  if (!loading && !object) {
    return <NotFoundText>Objekt nicht gefunden.</NotFoundText>;
  }

  return (
    <>
      {object && <ObjectHeader object={object} statusLabels={statusLabels} />}

      <Tabs tabs={TABS} activeTab={tab} onChange={(t) => setTab(t as TabId)} />

      <TabContent>
        {loading || !object ? (
          loading ? (
            <Loader />
          ) : null
        ) : (
          <>
            {tab === "notes" && (
              <NotesFeed
                objectId={object.id}
                objectTitle={object.title}
                highlightNoteId={noteParam ?? undefined}
              />
            )}
            {tab === "photos" && (
              <PhotoGrid
                objectId={object.id}
                highlightPhotoId={photoParam ?? undefined}
                objectTitle={object.title}
              />
            )}
            {tab === "checklist" && (
              <ChecklistTab
                checklist={object.checklist}
                doneCount={doneCount}
                checklistPct={checklistPct}
                onToggleCheck={toggleCheck}
                onRemoveItem={removeCheckItem}
                newCheckItem={newCheckItem}
                setNewCheckItem={setNewCheckItem}
                onAddItem={addCheckItem}
              />
            )}
            {tab === "info" && (
              <InfoTab
                object={object}
                isAdmin={isAdmin}
                onEdit={() => setShowEditModal(true)}
                onDelete={handleDelete}
                statusLabels={statusLabels}
              />
            )}
          </>
        )}
      </TabContent>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Objekt bearbeiten"
      >
        <ObjectForm
          initial={object ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

export default ObjectDetailPage;
