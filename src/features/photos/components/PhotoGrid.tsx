import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { subscribeToPhotos, deletePhoto } from '@shared/services/photosService';
import { Badge } from '@shared/ui/Badge';
import { PhotoUpload } from './PhotoUpload';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useToast } from '@shared/ui/Toast';
import { useAuth } from '@shared/hooks/useAuth';
import type { Photo } from '@shared/types';
import { Spinner } from '@shared/ui/Spinner';
import {
  Wrapper,
  Grid,
  PhotoCard,
  Img,
  Overlay,
  Caption,
  DeleteBtn,
  Lightbox,
  LightboxImg,
  Empty,
  LoadingWrapper,
} from './PhotoGrid.styles';

const photoTypeLabels: Record<string, string> = {
  before: 'Vorher',
  after: 'Nachher',
  daily: 'Täglich',
  problem: 'Problem',
};

interface Props {
  objectId: string;
  highlightPhotoId?: string;
  objectTitle?: string;
}

export const PhotoGrid: React.FC<Props> = ({ objectId, highlightPhotoId, objectTitle }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const confirm = useConfirm();
  const toast = useToast();
  const { uid, isAdmin } = useAuth();

  useEffect(() => {
    const unsub = subscribeToPhotos(objectId, (data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsub;
  }, [objectId]);

  useEffect(() => {
    if (!highlightPhotoId || loading) return;
    const el = document.getElementById(`photo-${highlightPhotoId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightPhotoId, loading]);

  const handleDelete = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    e.preventDefault();
    const ok = await confirm({
      title: 'Foto löschen',
      message: `Foto "${photo.caption || photo.type}" wirklich permanent löschen?`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deletePhoto(objectId, photo);
      toast.success('Foto gelöscht');
      if (lightbox?.id === photo.id) setLightbox(null);
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  if (loading) return <LoadingWrapper><Spinner /></LoadingWrapper>;

  return (
    <Wrapper>
      <PhotoUpload objectId={objectId} objectTitle={objectTitle} />

      {photos.length === 0 ? (
        <Empty>Noch keine Fotos hochgeladen.</Empty>
      ) : (
        <Grid>
          {photos.map((photo) => (
            <PhotoCard key={photo.id} id={`photo-${photo.id}`} $highlighted={photo.id === highlightPhotoId} onClick={() => setLightbox(photo)}>
              <Img src={photo.url} alt={photo.caption || 'Foto'} loading="lazy" />
              {(isAdmin || photo.uploadedBy === uid) && (
                <DeleteBtn
                  className="delete-btn"
                  title="Foto löschen"
                  onClick={(e) => handleDelete(e, photo)}
                >
                  <FiTrash2 size={14} />
                </DeleteBtn>
              )}
              <Overlay>
                <Badge $photoType={photo.type}>{photoTypeLabels[photo.type]}</Badge>
                {photo.caption && <Caption>{photo.caption}</Caption>}
              </Overlay>
            </PhotoCard>
          ))}
        </Grid>
      )}

      {lightbox && (
        <Lightbox onClick={() => setLightbox(null)}>
          <LightboxImg src={lightbox.url} alt={lightbox.caption} />
        </Lightbox>
      )}
    </Wrapper>
  );
};
