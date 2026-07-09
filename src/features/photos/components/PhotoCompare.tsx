import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { subscribeToComparisons, deleteComparison } from '@features/photos/services';
import { useAuth } from '@features/auth/hooks';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { useToast } from '@shared/ui/Toast';
import type { Photo, PhotoComparison } from '@shared/types';
import { ComparisonCard } from './ComparisonCard';
import { ComparisonPickerSheet } from './ComparisonPickerSheet';
import {
  CompareWrapper,
  CreateBtn,
  CompareList,
  CompareEmpty,
  CompareEmptyTitle,
  CompareEmptyHint,
} from './PhotoCompare.styles';

interface Props {
  objectId: string;
  photos: Photo[];
}

export const PhotoCompare: React.FC<Props> = ({ objectId, photos }) => {
  const [comparisons, setComparisons] = useState<PhotoComparison[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { uid, isAdmin } = useAuth();
  const confirm = useConfirm();
  const toast = useToast();

  useEffect(() => {
    const unsub = subscribeToComparisons(objectId, setComparisons);
    return unsub;
  }, [objectId]);

  const handleDelete = async (comparison: PhotoComparison) => {
    const ok = await confirm({
      title: 'Vergleich löschen',
      message: 'Diesen Vorher/Nachher-Vergleich wirklich löschen?',
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteComparison(objectId, comparison.id, comparison.beforeUrl, comparison.afterUrl);
      toast.success('Vergleich gelöscht');
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  return (
    <CompareWrapper>
      <CreateBtn onClick={() => setSheetOpen(true)}>
        <FiPlus size={14} />
        Vergleich erstellen
      </CreateBtn>

      {comparisons.length === 0 ? (
        <CompareEmpty>
          <CompareEmptyTitle>Noch keine Vergleiche</CompareEmptyTitle>
          <CompareEmptyHint>
            Erstelle einen Vorher/Nachher-Vergleich aus vorhandenen Fotos oder mit der Kamera.
          </CompareEmptyHint>
        </CompareEmpty>
      ) : (
        <CompareList>
          {comparisons.map((c) => (
            <ComparisonCard
              key={c.id}
              comparison={c}
              canDelete={isAdmin || c.createdBy === uid}
              onDelete={handleDelete}
            />
          ))}
        </CompareList>
      )}

      <ComparisonPickerSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        objectId={objectId}
        photos={photos}
      />
    </CompareWrapper>
  );
};
