import React, { useRef, useState } from 'react';
import { FiCamera, FiImage } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { Button } from '@shared/ui/Button';
import { useAuth } from '@features/auth/hooks';
import { useToast } from '@shared/ui/Toast';
import { uploadComparisonImage, createComparison } from '@features/photos/services';
import type { Photo } from '@shared/types';
import {
  SlotSection,
  SlotLabel,
  SlotButtons,
  SlotBtn,
  HiddenInput,
  SlotPreview,
  SlotPreviewImg,
  ChangeBtn,
  ProgressBar,
  ThumbGrid,
  ThumbImg,
  NoPhotosHint,
  CancelPickBtn,
  Footer,
  ErrorBox,
} from './ComparisonPickerSheet.styles';

type SlotKey = 'before' | 'after';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  objectId: string;
  photos: Photo[];
}

const SLOT_LABELS: Record<SlotKey, string> = { before: 'Vorher', after: 'Nachher' };

const emptyUrls: Record<SlotKey, string | null> = { before: null, after: null };

export const ComparisonPickerSheet: React.FC<Props> = ({ isOpen, onClose, objectId, photos }) => {
  const [urls, setUrls] = useState<Record<SlotKey, string | null>>(emptyUrls);
  const [pickerFor, setPickerFor] = useState<SlotKey | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<SlotKey | null>(null);
  const [progress, setProgress] = useState(0);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const cameraRefs = useRef<Record<SlotKey, HTMLInputElement | null>>({ before: null, after: null });
  const { uid, user } = useAuth();
  const toast = useToast();

  const reset = () => {
    setUrls(emptyUrls);
    setPickerFor(null);
    setUploadingSlot(null);
    setProgress(0);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCapture = async (slot: SlotKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploadingSlot(slot);
    setProgress(0);
    try {
      const url = await uploadComparisonImage(objectId, file, setProgress);
      setUrls((prev) => ({ ...prev, [slot]: url }));
    } catch (err) {
      console.error('[ComparisonPickerSheet] upload failed:', err);
      setError('Upload fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setUploadingSlot(null);
      setProgress(0);
    }
  };

  const handlePickExisting = (slot: SlotKey, url: string) => {
    setUrls((prev) => ({ ...prev, [slot]: url }));
    setPickerFor(null);
  };

  const handleCreate = async () => {
    if (!urls.before || !urls.after || !uid || !user) return;
    setCreating(true);
    setError('');
    try {
      await createComparison(objectId, urls.before, urls.after, uid, user.name);
      toast.success('Vergleich erstellt');
      handleClose();
    } catch (err) {
      console.error('[ComparisonPickerSheet] create failed:', err);
      setError('Erstellen fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setCreating(false);
    }
  };

  const renderSlot = (slot: SlotKey) => {
    const url = urls[slot];
    const isUploading = uploadingSlot === slot;

    return (
      <SlotSection key={slot}>
        <SlotLabel>{SLOT_LABELS[slot]}</SlotLabel>

        {url ? (
          <SlotPreview>
            <SlotPreviewImg src={url} alt={SLOT_LABELS[slot]} />
            <ChangeBtn onClick={() => setUrls((prev) => ({ ...prev, [slot]: null }))}>
              Ändern
            </ChangeBtn>
          </SlotPreview>
        ) : isUploading ? (
          <ProgressBar $progress={progress} />
        ) : pickerFor === slot ? (
          <>
            {photos.length === 0 ? (
              <NoPhotosHint>Keine vorhandenen Fotos.</NoPhotosHint>
            ) : (
              <ThumbGrid>
                {photos.map((p) => (
                  <ThumbImg
                    key={p.id}
                    src={p.url}
                    alt=""
                    onClick={() => handlePickExisting(slot, p.url)}
                  />
                ))}
              </ThumbGrid>
            )}
            <CancelPickBtn onClick={() => setPickerFor(null)}>Abbrechen</CancelPickBtn>
          </>
        ) : (
          <SlotButtons>
            <SlotBtn type="button" onClick={() => cameraRefs.current[slot]?.click()}>
              <FiCamera size={15} />
              Kamera
            </SlotBtn>
            <HiddenInput
              ref={(el) => { cameraRefs.current[slot] = el; }}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleCapture(slot, e)}
            />
            <SlotBtn type="button" onClick={() => setPickerFor(slot)}>
              <FiImage size={15} />
              Aus Fotos
            </SlotBtn>
          </SlotButtons>
        )}
      </SlotSection>
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Vergleich erstellen">
      {error && <ErrorBox>{error}</ErrorBox>}

      {renderSlot('before')}
      {renderSlot('after')}

      <Footer>
        <Button
          $fullWidth
          onClick={handleCreate}
          disabled={!urls.before || !urls.after || creating}
        >
          {creating ? 'Wird erstellt…' : 'Erstellen'}
        </Button>
      </Footer>
    </BottomSheet>
  );
};
