import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { NotesFeed } from "@features/notes/components/NotesFeed";
import { PhotoGrid } from "@features/photos/components/PhotoGrid";
import { Modal } from "@shared/ui/Modal";
import { ObjectForm } from "@features/objects/components/ObjectForm";
import { Loader } from "@shared/ui/Loader";
import { useAuth } from "@shared/hooks/useAuth";
import { useObjectDetail } from "@features/objects/hooks/useObjectDetail";
import { ObjectHeader } from "./components/ObjectHeader";
import { InfoTab } from "./components/InfoTab";
import {
  PageBody,
  NotFoundText,
  ContentGrid,
  LeftCol,
  RightCol,
  SectionBlock,
  SectionHeader,
  SectionLabel,
  NotesBadge,
  AdminSection,
} from "./ObjectDetailPage.styles";

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const photoParam = searchParams.get("photo");
  const noteParam = searchParams.get("note");
  const { isAdmin } = useAuth();

  const {
    object,
    loading,
    showEditModal,
    setShowEditModal,
    handleUpdate,
    handleDelete,
  } = useObjectDetail(id, () => navigate("/"));

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
          <ContentGrid>
            {/* LEFT: Notizen */}
            <LeftCol>
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
            </LeftCol>

            {/* RIGHT: Fotos + Admin (stacked on mobile, side-by-side on desktop) */}
            <RightCol>
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
            </RightCol>
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
