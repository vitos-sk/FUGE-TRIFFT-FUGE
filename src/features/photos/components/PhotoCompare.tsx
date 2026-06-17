import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Photo } from '@shared/types';
import {
  CompareWrapper,
  CompareContainer,
  CompareAfterImg,
  CompareBeforeImg,
  CompareLabel,
  CompareDivider,
  DividerLine,
  DividerKnob,
  ThumbSection,
  ThumbGroup,
  ThumbGroupLabel,
  ThumbRow,
  ThumbImg,
  CompareEmpty,
  CompareEmptyTitle,
  CompareEmptyHint,
} from './PhotoCompare.styles';

interface Props {
  photos: Photo[];
}

export const PhotoCompare: React.FC<Props> = ({ photos }) => {
  const beforePhotos = useMemo(() => photos.filter((p) => p.type === 'before'), [photos]);
  const afterPhotos = useMemo(() => photos.filter((p) => p.type === 'after'), [photos]);

  const [beforeIdx, setBeforeIdx] = useState(0);
  const [afterIdx, setAfterIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const setPos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pos = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    el.style.setProperty('--slider-pos', `${pos}%`);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setPos(e.clientX);
    },
    [setPos],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDragging.current) setPos(e.clientX);
    },
    [setPos],
  );

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (beforePhotos.length === 0 || afterPhotos.length === 0) {
    return (
      <CompareEmpty>
        <CompareEmptyTitle>Kein Vergleich möglich</CompareEmptyTitle>
        <CompareEmptyHint>
          {beforePhotos.length === 0 && 'Noch keine Vorher-Fotos vorhanden. '}
          {afterPhotos.length === 0 && 'Noch keine Nachher-Fotos vorhanden. '}
          Lade Fotos mit Typ "Vorher" und "Nachher" hoch.
        </CompareEmptyHint>
      </CompareEmpty>
    );
  }

  const beforePhoto = beforePhotos[Math.min(beforeIdx, beforePhotos.length - 1)];
  const afterPhoto = afterPhotos[Math.min(afterIdx, afterPhotos.length - 1)];
  const showThumbs = beforePhotos.length > 1 || afterPhotos.length > 1;

  return (
    <CompareWrapper>
      <CompareContainer
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <CompareAfterImg src={afterPhoto.url} alt="Nachher" draggable={false} />
        <CompareBeforeImg src={beforePhoto.url} alt="Vorher" draggable={false} />

        <CompareLabel $side="left">Vorher</CompareLabel>
        <CompareLabel $side="right">Nachher</CompareLabel>

        <CompareDivider>
          <DividerLine />
          <DividerKnob>
            <FiChevronLeft size={11} />
            <FiChevronRight size={11} />
          </DividerKnob>
        </CompareDivider>
      </CompareContainer>

      {showThumbs && (
        <ThumbSection>
          {beforePhotos.length > 1 && (
            <ThumbGroup>
              <ThumbGroupLabel>Vorher</ThumbGroupLabel>
              <ThumbRow>
                {beforePhotos.map((p, i) => (
                  <ThumbImg
                    key={p.id}
                    src={p.url}
                    $active={i === beforeIdx}
                    onClick={() => setBeforeIdx(i)}
                    alt=""
                    draggable={false}
                  />
                ))}
              </ThumbRow>
            </ThumbGroup>
          )}
          {afterPhotos.length > 1 && (
            <ThumbGroup>
              <ThumbGroupLabel>Nachher</ThumbGroupLabel>
              <ThumbRow>
                {afterPhotos.map((p, i) => (
                  <ThumbImg
                    key={p.id}
                    src={p.url}
                    $active={i === afterIdx}
                    onClick={() => setAfterIdx(i)}
                    alt=""
                    draggable={false}
                  />
                ))}
              </ThumbRow>
            </ThumbGroup>
          )}
        </ThumbSection>
      )}
    </CompareWrapper>
  );
};
