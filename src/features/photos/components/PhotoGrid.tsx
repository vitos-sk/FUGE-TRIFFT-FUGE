import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiMaximize2,
  FiColumns,
  FiImage,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { deletePhoto } from '@features/photos/services';
import { PhotoUpload } from './PhotoUpload';
import { PhotoCompare } from './PhotoCompare';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useToast } from '@shared/ui/Toast';
import { useAuth } from '@features/auth/hooks';
import { formatDayHeading } from '@shared/utils/dateLabels';
import type { Photo } from '@shared/types';
import { Loader } from '@shared/ui/Loader';
import {
  Wrapper,
  DayGroup,
  DayHeading,
  Grid,
  PhotoCard,
  Img,
  Overlay,
  StampRow,
  StampDot,
  CardCaption,
  MenuBtn,
  SheetActions,
  SheetAction,
  CompareFab,
  Lightbox,
  LightboxInner,
  LightboxImg,
  LightboxClose,
  LightboxFooter,
  LightboxCaption,
  LightboxCounter,
  LightboxNav,
  Empty,
  EmptyTitle,
  EmptyHint,
} from './PhotoGrid.styles';

type ViewMode = 'fotos' | 'vergleich';

interface Props {
  objectId: string;
  photos: Photo[];
  loading: boolean;
  highlightPhotoId?: string;
  objectTitle?: string;
}

/** "Vitalii Schmidt" → "VS", "Dmitriy" → "DM" */
const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/** Photos come sorted newest first — group them into days in that same order */
const groupByDay = (photos: Photo[]) => {
  const groups: { key: string; label: string; photos: Photo[] }[] = [];
  photos.forEach((photo) => {
    const date = photo.uploadedAt?.toDate?.() ?? null;
    const key = date ? format(date, 'yyyy-MM-dd') : 'unknown';
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.photos.push(photo);
      return;
    }
    groups.push({
      key,
      label: date ? formatDayHeading(date) : 'Ohne Datum',
      photos: [photo],
    });
  });
  return groups;
};

export const PhotoGrid: React.FC<Props> = ({
  objectId,
  photos,
  loading,
  highlightPhotoId,
  objectTitle,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>('fotos');
  const [menuPhoto, setMenuPhoto] = useState<Photo | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const confirm = useConfirm();
  const toast = useToast();
  const { uid, isAdmin } = useAuth();

  const groups = useMemo(() => groupByDay(photos), [photos]);

  useEffect(() => {
    if (!highlightPhotoId || loading) return;
    const el = document.getElementById(`photo-${highlightPhotoId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightPhotoId, loading]);

  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );

  const goNext = useCallback(
    () =>
      setLightboxIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)),
    [photos.length],
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

  const handleDelete = async (photo: Photo) => {
    setMenuPhoto(null);
    const ok = await confirm({
      title: 'Foto löschen',
      message: `Foto "${photo.caption || 'Foto'}" wirklich permanent löschen?`,
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deletePhoto('objects', objectId, photo);
      toast.success('Foto gelöscht');
      if (lightboxIndex !== null && photos[lightboxIndex]?.id === photo.id) {
        setLightboxIndex(null);
      }
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const openLightboxFor = (photo: Photo) => {
    setMenuPhoto(null);
    const idx = photos.findIndex((p) => p.id === photo.id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  // Clamp during render so deleting the last photo can't leave a stale index
  const lbIndex =
    lightboxIndex === null || photos.length === 0
      ? null
      : Math.min(lightboxIndex, photos.length - 1);
  const lbPhoto = lbIndex !== null ? photos[lbIndex] : undefined;
  const canDeleteMenuPhoto =
    !!menuPhoto && (isAdmin || menuPhoto.uploadedBy === uid);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PhotoUpload objectId={objectId} objectTitle={objectTitle} />

          {view === 'vergleich' ? (
            <PhotoCompare objectId={objectId} photos={photos} />
          ) : photos.length === 0 ? (
            <Empty>
              <EmptyTitle>Noch keine Fotos</EmptyTitle>
              <EmptyHint>
                Halte den Fortschritt mit einem ersten Foto fest.
              </EmptyHint>
            </Empty>
          ) : (
            groups.map((group) => (
              <DayGroup key={group.key}>
                <DayHeading>{group.label}</DayHeading>
                <Grid>
                  {group.photos.map((photo) => {
                    const uploadedAt = photo.uploadedAt?.toDate?.() ?? null;
                    return (
                      <PhotoCard
                        key={photo.id}
                        id={`photo-${photo.id}`}
                        $highlighted={photo.id === highlightPhotoId}
                        onClick={() => openLightboxFor(photo)}
                      >
                        <Img
                          src={photo.url}
                          alt={photo.caption || 'Foto'}
                          loading="lazy"
                        />
                        <Overlay>
                          <div>
                            <StampRow>
                              {uploadedAt ? format(uploadedAt, 'HH:mm') : '—'}
                              <StampDot>·</StampDot>
                              {initials(photo.uploadedByName || '?')}
                            </StampRow>
                            {photo.caption && (
                              <CardCaption>{photo.caption}</CardCaption>
                            )}
                          </div>
                        </Overlay>
                        <MenuBtn
                          title="Optionen"
                          aria-label="Foto-Optionen"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuPhoto(photo);
                          }}
                        >
                          <FiMoreVertical size={15} />
                        </MenuBtn>
                      </PhotoCard>
                    );
                  })}
                </Grid>
              </DayGroup>
            ))
          )}

          <CompareFab
            $active={view === 'vergleich'}
            onClick={() =>
              setView((v) => (v === 'fotos' ? 'vergleich' : 'fotos'))
            }
          >
            {view === 'fotos' ? (
              <>
                <FiColumns size={17} />
                Vorher / Nachher
              </>
            ) : (
              <>
                <FiImage size={17} />
                Fotos
              </>
            )}
          </CompareFab>

          <BottomSheet
            isOpen={!!menuPhoto}
            onClose={() => setMenuPhoto(null)}
            title={menuPhoto?.caption || 'Foto'}
          >
            <SheetActions>
              <SheetAction onClick={() => menuPhoto && openLightboxFor(menuPhoto)}>
                <FiMaximize2 size={17} />
                In voller Größe ansehen
              </SheetAction>
              {canDeleteMenuPhoto && (
                <SheetAction
                  $danger
                  onClick={() => menuPhoto && handleDelete(menuPhoto)}
                >
                  <FiTrash2 size={17} />
                  Foto löschen
                </SheetAction>
              )}
            </SheetActions>
          </BottomSheet>

          {lbPhoto && (
            <Lightbox
              data-lightbox
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
                  {lbPhoto.caption && <LightboxCaption>{lbPhoto.caption}</LightboxCaption>}
                  <LightboxCounter>{lbIndex! + 1} / {photos.length}</LightboxCounter>
                </LightboxFooter>
              </LightboxInner>

              {lbIndex! > 0 && (
                <LightboxNav $side="left" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                  <FiChevronLeft size={22} />
                </LightboxNav>
              )}
              {lbIndex! < photos.length - 1 && (
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
