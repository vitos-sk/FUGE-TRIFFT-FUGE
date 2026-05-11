import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { subscribeToPhotos } from '../../services/photosService';
import { Badge } from '../ui/Badge';
import { PhotoUpload } from './PhotoUpload';
import type { Photo } from '../../types';
import { Spinner } from '../ui/Spinner';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgElevated};
  transition: all ${({ theme }) => theme.transitions.spring};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: 0 8px 28px rgba(0,0,0,0.5);
    transform: scale(1.02);
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};
  animation: ${fadeIn} 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.78));
  padding: 20px 10px 10px;
`;

const Caption = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
  line-height: 1.3;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.96);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.15s ease;
  touch-action: auto;
  overflow: auto;
`;

const LightboxImg = styled.img`
  max-width: 95vw;
  max-height: 92vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  box-shadow: 0 24px 80px rgba(0,0,0,0.9);
  touch-action: pinch-zoom;
`;

const photoTypeLabels: Record<string, string> = {
  before: 'Vorher',
  after: 'Nachher',
  daily: 'Täglich',
  problem: 'Problem',
};

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
  padding: 40px 0;
`;

interface Props {
  objectId: string;
}

export const PhotoGrid: React.FC<Props> = ({ objectId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    const unsub = subscribeToPhotos(objectId, (data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsub;
  }, [objectId]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>;

  return (
    <Wrapper>
      <PhotoUpload objectId={objectId} />

      {photos.length === 0 ? (
        <Empty>Noch keine Fotos hochgeladen.</Empty>
      ) : (
        <Grid>
          {photos.map((photo) => (
            <PhotoCard key={photo.id} onClick={() => setLightbox(photo)}>
              <Img src={photo.url} alt={photo.caption || 'Foto'} loading="lazy" />
              <Overlay>
                <Badge photoType={photo.type}>{photoTypeLabels[photo.type]}</Badge>
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
