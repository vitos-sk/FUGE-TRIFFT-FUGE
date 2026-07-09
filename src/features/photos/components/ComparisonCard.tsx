import React, { useCallback, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import type { PhotoComparison } from '@shared/types';
import {
  Card,
  CompareContainer,
  CompareAfterImg,
  CompareBeforeImg,
  CompareLabel,
  CompareDivider,
  DividerLine,
  DividerKnob,
  DeleteBtn,
  Meta,
} from './ComparisonCard.styles';

interface Props {
  comparison: PhotoComparison;
  canDelete: boolean;
  onDelete: (comparison: PhotoComparison) => void;
}

export const ComparisonCard: React.FC<Props> = ({ comparison, canDelete, onDelete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [deletePressed, setDeletePressed] = useState(false);

  const setPos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pos = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    el.style.setProperty('--slider-pos', `${pos}%`);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button, [data-drag-ignore]')) return;
      e.preventDefault();
      isDragging.current = true;
      // Marks the slider drag globally so the tab-swipe listener in
      // ObjectDetailPage can recognize the gesture even if the finger
      // physically ends up outside this container (touchend isn't
      // retargeted by setPointerCapture the way pointer events are).
      document.body.setAttribute('data-slider-dragging', 'true');
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
    // pointerup fires (and is retargeted by pointer capture) before the
    // corresponding touchend — defer clearing the flag so that touchend
    // still sees the drag as active.
    setTimeout(() => {
      document.body.removeAttribute('data-slider-dragging');
    }, 0);
  }, []);

  return (
    <Card>
      <CompareContainer
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <CompareAfterImg src={comparison.afterUrl} alt="Nachher" draggable={false} />
        <CompareBeforeImg src={comparison.beforeUrl} alt="Vorher" draggable={false} />

        <CompareLabel $side="left">Vorher</CompareLabel>
        <CompareLabel $side="right">Nachher</CompareLabel>

        <CompareDivider>
          <DividerLine />
          <DividerKnob>
            <FiChevronLeft size={11} />
            <FiChevronRight size={11} />
          </DividerKnob>
        </CompareDivider>

        {canDelete && (
          <DeleteBtn
            type="button"
            data-drag-ignore="true"
            $pressed={deletePressed}
            title="Vergleich löschen"
            onPointerDown={(e) => {
              e.stopPropagation();
              setDeletePressed(true);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setDeletePressed(false);
            }}
            onPointerCancel={() => setDeletePressed(false)}
            onPointerLeave={() => setDeletePressed(false)}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comparison);
            }}
          >
            <FiTrash2 size={13} />
          </DeleteBtn>
        )}
      </CompareContainer>
      <Meta>von {comparison.createdByName}</Meta>
    </Card>
  );
};
