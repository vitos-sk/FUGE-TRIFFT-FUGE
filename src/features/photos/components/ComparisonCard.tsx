import React, { useCallback, useRef } from 'react';
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
          <DeleteBtn title="Vergleich löschen" onClick={() => onDelete(comparison)}>
            <FiTrash2 size={13} />
          </DeleteBtn>
        )}
      </CompareContainer>
      <Meta>von {comparison.createdByName}</Meta>
    </Card>
  );
};
