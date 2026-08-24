import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FiImage, FiMessageSquare } from "react-icons/fi";
import { NotesFeed } from "@features/notes/components/NotesFeed";
import { PhotoGrid } from "@features/photos/components/PhotoGrid";
import { usePhotos } from "@features/photos/hooks";
import { Modal } from "@shared/ui/Modal";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Loader } from "@shared/ui/Loader";
import { useAuth } from '@features/auth/hooks';
import { useObjectDetail } from "@features/objects/hooks/useObjectDetail";
import { ObjectHeader } from "./components/ObjectHeader";
import { InfoTab } from "./components/InfoTab";
import {
  PageBody,
  NotFoundText,
  TabsBar,
  TabBtn,
  TabBadge,
  SectionBlock,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
} from "./ObjectDetailPage.styles";

type DetailTab = "fotos" | "chat";

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const photoParam = searchParams.get("photo");
  const noteParam = searchParams.get("note");
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<DetailTab>(noteParam ? "chat" : "fotos");
  const [showInfoModal, setShowInfoModal] = useState(false);

  const {
    object,
    loading,
    showEditModal,
    setShowEditModal,
    handleUpdate,
    handleDelete,
  } = useObjectDetail(id, () => navigate("/"));

  // One photo subscription for the page: the header shows the count, the grid the photos
  const { photos, loading: photosLoading } = usePhotos(id);

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
      if ((e.target as Element).closest("[data-compare-slider]")) return;
      // Fallback for when the finger leaves the compare slider's DOM bounds
      // mid-drag: touchend isn't retargeted by setPointerCapture the way
      // pointer events are, so closest() above can miss it.
      if (document.body.hasAttribute("data-slider-dragging")) return;
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
      {object && (
        <ObjectHeader
          object={object}
          photoCount={photos.length}
          onOpenInfo={() => setShowInfoModal(true)}
        />
      )}

      {loading ? (
        <Loader />
      ) : object ? (
        <PageBody>
          <TabsBar role="tablist">
            <TabBtn
              role="tab"
              aria-selected={activeTab === "fotos"}
              $active={activeTab === "fotos"}
              onClick={() => setActiveTab("fotos")}
            >
              <FiImage size={16} />
              Fotos
            </TabBtn>
            <TabBtn
              role="tab"
              aria-selected={activeTab === "chat"}
              $active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
            >
              <FiMessageSquare size={16} />
              Chat
              {!!object.noteCount && <TabBadge>{object.noteCount}</TabBadge>}
            </TabBtn>
          </TabsBar>

          {activeTab === "fotos" && (
            <SectionBlock>
              <SectionHeader>
                <div>
                  <SectionTitle>Baustellendokumentation</SectionTitle>
                  <SectionSubtitle>
                    Fortschritt und wichtige Details festhalten
                  </SectionSubtitle>
                </div>
              </SectionHeader>
              <PhotoGrid
                objectId={object.id}
                photos={photos}
                loading={photosLoading}
                highlightPhotoId={photoParam ?? undefined}
                objectTitle={object.title}
              />
            </SectionBlock>
          )}

          {activeTab === "chat" && (
            <SectionBlock>
              <SectionHeader>
                <div>
                  <SectionTitle>Projekt-Chat</SectionTitle>
                  <SectionSubtitle>
                    Nachrichten, Fragen und wichtige Infos zum Objekt
                  </SectionSubtitle>
                </div>
              </SectionHeader>
              <NotesFeed
                objectId={object.id}
                objectTitle={object.title}
                highlightNoteId={noteParam ?? undefined}
              />
            </SectionBlock>
          )}
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

      {object && (
        <Modal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title="Objektdetails"
        >
          <InfoTab
            object={object}
            isAdmin={isAdmin}
            onEdit={() => {
              setShowInfoModal(false);
              setShowEditModal(true);
            }}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </>
  );
};

export default ObjectDetailPage;
