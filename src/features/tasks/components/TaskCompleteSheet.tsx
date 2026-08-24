import React, { useEffect, useRef, useState } from 'react';
import { FiCamera, FiImage, FiX, FiCheck } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { completeTask } from '@features/tasks/services';
import { uploadPhoto, subscribeToPhotos } from '@features/photos/services';
import { useAuth } from '@features/auth/hooks';
import { useToast } from '@shared/ui/Toast';
import { Grid, PhotoCard, Img } from '@features/photos/components/PhotoGrid.styles';
import { PickerRow, PickerBtn, HiddenInput, ProgressBar, UploadingLabel, ErrorBox } from '@features/photos/components/PhotoUpload.styles';
import type { Task, Photo } from '@shared/types';
import {
  Body,
  CompleteBtn,
  UploadBtn,
  Divider,
  PendingGrid,
  PendingThumb,
  RemoveBtn,
  SectionLabel,
  Empty,
} from './TaskCompleteSheet.styles';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'application/octet-stream'];
const TASKS_BASE_PATH = 'tasks';

interface PendingFile {
  file: File;
  preview: string;
}

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (task: Task) => void;
}

export const TaskCompleteSheet: React.FC<Props> = ({ task, isOpen, onClose, onCompleted }) => {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const { user, uid } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToPhotos(TASKS_BASE_PATH, task.id, setPhotos);
    return unsub;
  }, [isOpen, task.id]);

  const handleClose = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.preview));
    setPending([]);
    setError('');
    setProgress(0);
    onClose();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const valid: PendingFile[] = [];
    for (const f of files) {
      const isImage = ACCEPTED.includes(f.type) || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name);
      if (!isImage || f.size > 50 * 1024 * 1024) continue;
      valid.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setPending((prev) => [...prev, ...valid]);
  };

  const removePending = (idx: number) => {
    setPending((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUploadPending = async () => {
    if (pending.length === 0 || !uid || !user) return;
    setError('');
    setUploading(true);

    let failed = 0;
    for (let i = 0; i < pending.length; i++) {
      setProgress(0);
      try {
        await uploadPhoto(TASKS_BASE_PATH, task.id, pending[i].file, '', uid, user.name, setProgress);
      } catch {
        failed++;
      }
    }

    pending.forEach((p) => URL.revokeObjectURL(p.preview));
    setPending([]);
    setUploading(false);
    setProgress(0);

    if (failed > 0) {
      setError(`${failed} Foto${failed > 1 ? 's' : ''} konnte${failed > 1 ? 'n' : ''} nicht hochgeladen werden.`);
    } else {
      toast.success('Fotos hochgeladen');
    }
  };

  const handleComplete = async () => {
    setError('');
    setCompleting(true);
    try {
      await completeTask(task.id);
      toast.success('Aufgabe erledigt');
      onCompleted?.(task);
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      setError(`Fehler: ${msg || 'Bitte erneut versuchen.'}`);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Aufgabe erledigen">
      <Body>
        {error && <ErrorBox>{error}</ErrorBox>}

        <CompleteBtn type="button" onClick={handleComplete} disabled={completing}>
          <FiCheck size={16} />
          {completing ? 'Wird gespeichert…' : 'Erledigt'}
        </CompleteBtn>

        <Divider>Fotos (optional)</Divider>

        {!uploading && (
          <PickerRow>
            <PickerBtn htmlFor="task-photo-camera">
              <HiddenInput
                id="task-photo-camera"
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFilesChange}
              />
              <FiCamera size={15} />
              Kamera
            </PickerBtn>
            <PickerBtn htmlFor="task-photo-gallery">
              <HiddenInput
                id="task-photo-gallery"
                ref={galleryRef}
                type="file"
                accept="image/*,image/heic,image/heif"
                multiple
                onChange={handleFilesChange}
              />
              <FiImage size={15} />
              Galerie
            </PickerBtn>
          </PickerRow>
        )}

        {pending.length > 0 && (
          <>
            <PendingGrid>
              {pending.map((p, idx) => (
                <PendingThumb key={p.preview}>
                  <img src={p.preview} alt="Vorschau" />
                  {!uploading && (
                    <RemoveBtn type="button" onClick={() => removePending(idx)}>
                      <FiX size={11} />
                    </RemoveBtn>
                  )}
                </PendingThumb>
              ))}
            </PendingGrid>

            {uploading ? (
              <>
                <ProgressBar $progress={progress} />
                <UploadingLabel>Hochladen… {progress}%</UploadingLabel>
              </>
            ) : (
              <UploadBtn type="button" onClick={handleUploadPending}>
                {pending.length} Foto{pending.length > 1 ? 's' : ''} hochladen
              </UploadBtn>
            )}
          </>
        )}

        {photos.length > 0 && (
          <>
            <SectionLabel>Bereits hochgeladen</SectionLabel>
            <Grid>
              {photos.map((photo) => (
                <PhotoCard key={photo.id}>
                  <Img src={photo.url} alt={photo.caption || 'Foto'} loading="lazy" />
                </PhotoCard>
              ))}
            </Grid>
          </>
        )}

        {photos.length === 0 && pending.length === 0 && (
          <Empty>Noch keine Fotos zu dieser Aufgabe.</Empty>
        )}
      </Body>
    </BottomSheet>
  );
};
