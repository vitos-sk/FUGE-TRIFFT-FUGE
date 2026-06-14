import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiTrash2, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { subscribeToPhotos, deletePhoto } from '@shared/services/photosService';
import { Badge } from '@shared/ui/Badge';
import { PhotoUpload } from './PhotoUpload';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useToast } from '@shared/ui/Toast';
import { useAuth } from '@shared/hooks/useAuth';
import type { Photo } from '@shared/types';
import { Loader } from '@shared/ui/Loader';
import {
  Wrapper,
  Grid,
  PhotoCard,
  Img,
  Overlay,
  Caption,
  DeleteBtn,
  Lightbox,
  LightboxInner,
  LightboxImg,
  LightboxClose,
  LightboxFooter,
  LightboxCaption,
  LightboxCounter,
  LightboxNav,
  Empty,
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
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

  const goPrev = useCallback(() =>
    setLightboxIndex(i => (i !== null && i > 0) ? i - 1 : i), []);

  const goNext = useCallback(() =>
    setLightboxIndex(i => (i !== null && i < photos.length - 1) ? i + 1 : i),
    [photos.length]);

  // Клавиатурная навигация
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goNext, goPrev]);

  // Закрываем лайтбокс если удалённое фото было открыто
  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= photos.length) {
      setLightboxIndex(photos.length > 0 ? photos.length - 1 : null);
    }
  }, [photos.length, lightboxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Горизонтальный свайп — навигация
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0) goNext(); else goPrev();
    }
  };

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
      if (lightboxIndex !== null && photos[lightboxIndex]?.id === photo.id) {
        setLightboxIndex(null);
      }
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const lbPhoto = lightboxIndex !== null ? photos[lightboxIndex] : undefined;

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PhotoUpload objectId={objectId} objectTitle={objectTitle} />

          {photos.length === 0 ? (
            <Empty>Noch keine Fotos hochgeladen.</Empty>
          ) : (
            <Grid>
              {photos.map((photo, idx) => (
                <PhotoCard
                  key={photo.id}
                  id={`photo-${photo.id}`}
                  $highlighted={photo.id === highlightPhotoId}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <Img src={photo.url} alt={photo.caption || 'Foto'} loading="lazy" />
                  {(isAdmin || photo.uploadedBy === uid) && (
                    <DeleteBtn
                      className="delete-btn"
                      title="Foto löschen"
                      onClick={(e) => handleDelete(e, photo)}
                    >
                      <FiTrash2 size={13} />
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

          {lbPhoto && (
            <Lightbox
              onClick={() => setLightboxIndex(null)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Кнопка закрытия — всегда видна */}
              <LightboxClose onClick={e => { e.stopPropagation(); setLightboxIndex(null); }}>
                <FiX size={16} />
              </LightboxClose>

              {/* Изображение + инфо — клик внутри не закрывает */}
              <LightboxInner onClick={e => e.stopPropagation()}>
                <LightboxImg src={lbPhoto.url} alt={lbPhoto.caption || 'Foto'} />
                <LightboxFooter>
                  <Badge $photoType={lbPhoto.type}>{photoTypeLabels[lbPhoto.type]}</Badge>
                  {lbPhoto.caption && <LightboxCaption>{lbPhoto.caption}</LightboxCaption>}
                  <LightboxCounter>{lightboxIndex! + 1} / {photos.length}</LightboxCounter>
                </LightboxFooter>
              </LightboxInner>

              {/* Стрелки — только на десктопе */}
              {lightboxIndex! > 0 && (
                <LightboxNav $side="left" onClick={e => { e.stopPropagation(); goPrev(); }}>
                  <FiChevronLeft size={22} />
                </LightboxNav>
              )}
              {lightboxIndex! < photos.length - 1 && (
                <LightboxNav $side="right" onClick={e => { e.stopPropagation(); goNext(); }}>
                  <FiChevronRight size={22} />
                </LightboxNav>
              )}
            </Lightbox>
          )}
        </>
      )}
    </Wrapper>
  );
};
