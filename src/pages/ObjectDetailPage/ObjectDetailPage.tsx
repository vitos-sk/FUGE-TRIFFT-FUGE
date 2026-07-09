import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FiImage, FiMessageSquare } from "react-icons/fi";
import { NotesFeed } from "@features/notes/components/NotesFeed";
import { PhotoGrid } from "@features/photos/components/PhotoGrid";
import { Modal } from "@shared/ui/Modal";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Loader } from "@shared/ui/Loader";
import { SegmentedControl, type SegOption } from "@shared/ui/SegmentedControl";
import { useAuth } from '@features/auth/hooks';
import { useObjectDetail } from "@features/objects/hooks/useObjectDetail";
import { ObjectHeader } from "./components/ObjectHeader";
import { InfoTab } from "./components/InfoTab";
import {
  PageBody,
  NotFoundText,
  TabBarWrapper,
  ContentGrid,
  SectionBlock,
  SectionHeader,
  SectionLabel,
  NotesBadge,
  AdminSection,
} from "./ObjectDetailPage.styles";

type DetailTab = "fotos" | "chat";

const TAB_OPTIONS: SegOption<DetailTab>[] = [
  { value: "fotos", label: "Fotos", icon: <FiImage size={14} /> },
  { value: "chat", label: "Chat", icon: <FiMessageSquare size={14} /> },
];

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const photoParam = searchParams.get("photo");
  const noteParam = searchParams.get("note");
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<DetailTab>(noteParam ? "chat" : "fotos");

  const {
    object,
    loading,
    showEditModal,
    setShowEditModal,
    handleUpdate,
    handleDelete,
  } = useObjectDetail(id, () => navigate("/"));

  // Swipe between Fotos/Chat, mirroring the HoursPage view/add gesture.
  // Ignore swipes inside the photo lightbox — that gesture navigates photos, not tabs.
  useEffect(() => {
    let startX = 0,
      startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.75) return;
      if ((e.target as Element).closest("[data-lightbox]")) return;
      if (dx < 0) setActiveTab("chat");
      else setActiveTab("fotos");
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, []);

  if (!loading && !object) {
    return <NotFoundText>Objekt nicht gefunden.</NotFoundText>;
  }

  return (
    <>
      {object && <ObjectHeader object={object} />}

      {loading ? (
        <Loader />
      ) : object ? (
        <PageBody>
          <TabBarWrapper>
            <SegmentedControl
              options={TAB_OPTIONS}
              value={activeTab}
              onChange={setActiveTab}
              variant="tabs"
            />
          </TabBarWrapper>

          <ContentGrid>
            {activeTab === "fotos" && (
              <SectionBlock>
                <SectionHeader>
                  <SectionLabel>Fotos</SectionLabel>
                </SectionHeader>
                <PhotoGrid
                  objectId={object.id}
                  highlightPhotoId={photoParam ?? undefined}
                  objectTitle={object.title}
                />
              </SectionBlock>
            )}

            {activeTab === "chat" && (
              <SectionBlock>
                <SectionHeader>
                  <SectionLabel>Notizen</SectionLabel>
                  {!!object.noteCount && (
                    <NotesBadge>{object.noteCount}</NotesBadge>
                  )}
                </SectionHeader>
                <NotesFeed
                  objectId={object.id}
                  objectTitle={object.title}
                  highlightNoteId={noteParam ?? undefined}
                />
              </SectionBlock>
            )}

            {isAdmin && (
              <AdminSection>
                <InfoTab
                  object={object}
                  isAdmin={isAdmin}
                  onEdit={() => setShowEditModal(true)}
                  onDelete={handleDelete}
                />
              </AdminSection>
            )}
          </ContentGrid>
        </PageBody>
      ) : null}

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
