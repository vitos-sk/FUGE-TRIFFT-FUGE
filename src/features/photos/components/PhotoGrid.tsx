import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiTrash2, FiX, FiChevronLeft, FiChevronRight, FiColumns } from 'react-icons/fi';
import { subscribeToPhotos, deletePhoto } from '@shared/services/photosService';
import { Badge } from '@shared/ui/Badge';
import { PhotoUpload } from './PhotoUpload';
import { PhotoCompare } from './PhotoCompare';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useToast } from '@shared/ui/Toast';
import { useAuth } from '@shared/hooks/useAuth';
import type { Photo, PhotoType } from '@shared/types';
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
  FilterRow,
  FilterChip,
} from './PhotoGrid.styles';

const photoTypeLabels: Record<PhotoType, string> = {
  before: 'Vorher',
  after: 'Nachher',
  daily: 'Täglich',
  problem: 'Problem',
};

type FilterKey = 'all' | PhotoType | 'compare';

interface FilterDef {
  key: FilterKey;
  label: string;
  color: string;
  icon?: React.ReactNode;
}

const FILTERS: FilterDef[] = [
  { key: 'all',     label: 'Alle',      color: '#cc2222' },
  { key: 'daily',   label: 'Täglich',   color: '#c9a84c' },
  { key: 'before',  label: 'Vorher',    color: '#3498db' },
  { key: 'after',   label: 'Nachher',   color: '#27ae60' },
  { key: 'problem', label: 'Problem',   color: '#c0392b' },
  { key: 'compare', label: 'Vergleich', color: '#8b5cf6', icon: <FiColumns size={11} /> },
];

interface Props {
  objectId: string;
  highlightPhotoId?: string;
  objectTitle?: string;
}

export const PhotoGrid: React.FC<Props> = ({ objectId, highlightPhotoId, objectTitle }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
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

  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all' || activeFilter === 'compare') return photos;
    return photos.filter((p) => p.type === activeFilter);
  }, [photos, activeFilter]);

  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );

  const goNext = useCallback(
    () =>
      setLightboxIndex((i) => (i !== null && i < filteredPhotos.length - 1 ? i + 1 : i)),
    [filteredPhotos.length],
  );

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

  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filteredPhotos.length) {
      setLightboxIndex(filteredPhotos.length > 0 ? filteredPhotos.length - 1 : null);
    }
  }, [filteredPhotos.length, lightboxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
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
      if (lightboxIndex !== null && filteredPhotos[lightboxIndex]?.id === photo.id) {
        setLightboxIndex(null);
      }
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const lbPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : undefined;

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PhotoUpload objectId={objectId} objectTitle={objectTitle} />

          {photos.length > 0 && (
            <FilterRow>
              {FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  $active={activeFilter === f.key}
                  $color={f.color}
                  onClick={() => setActiveFilter(f.key)}
                  aria-pressed={activeFilter === f.key}
                >
                  {f.icon}
                  {f.label}
                </FilterChip>
              ))}
            </FilterRow>
          )}

          {activeFilter === 'compare' ? (
            <PhotoCompare photos={photos} />
          ) : filteredPhotos.length === 0 ? (
            <Empty>
              {photos.length === 0
                ? 'Noch keine Fotos hochgeladen.'
                : 'Keine Fotos in dieser Kategorie.'}
            </Empty>
          ) : (
            <Grid>
              {filteredPhotos.map((photo, idx) => (
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
              <LightboxClose onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
                <FiX size={16} />
              </LightboxClose>

              <LightboxInner onClick={(e) => e.stopPropagation()}>
                <LightboxImg src={lbPhoto.url} alt={lbPhoto.caption || 'Foto'} />
                <LightboxFooter>
                  <Badge $photoType={lbPhoto.type}>{photoTypeLabels[lbPhoto.type]}</Badge>
                  {lbPhoto.caption && <LightboxCaption>{lbPhoto.caption}</LightboxCaption>}
                  <LightboxCounter>{lightboxIndex! + 1} / {filteredPhotos.length}</LightboxCounter>
                </LightboxFooter>
              </LightboxInner>

              {lightboxIndex! > 0 && (
                <LightboxNav $side="left" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                  <FiChevronLeft size={22} />
                </LightboxNav>
              )}
              {lightboxIndex! < filteredPhotos.length - 1 && (
                <LightboxNav $side="right" onClick={(e) => { e.stopPropagation(); goNext(); }}>
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
