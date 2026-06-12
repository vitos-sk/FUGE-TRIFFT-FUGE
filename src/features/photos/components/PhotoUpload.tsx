import React, { useRef, useState } from 'react';
import { FiCamera, FiImage, FiX } from 'react-icons/fi';
import { uploadPhoto } from '@shared/services/photosService';
import { useAuth } from '@shared/hooks/useAuth';
import { Button } from '@shared/ui/Button';
import { Select, FormGroup, Label, Input } from '@shared/ui/Input';
import { useToast } from '@shared/ui/Toast';
import type { PhotoType } from '@shared/types';
import {
  PickerRow,
  PickerBtn,
  PreviewBox,
  Preview,
  ClearBtn,
  Row,
  ProgressBar,
  UploadingLabel,
  ErrorBox,
  HiddenInput,
} from './PhotoUpload.styles';

const TYPE_OPTIONS: { value: PhotoType; label: string }[] = [
  { value: 'daily',   label: 'Täglich' },
  { value: 'before',  label: 'Vorher' },
  { value: 'after',   label: 'Nachher' },
  { value: 'problem', label: 'Problem' },
];

// iOS sometimes delivers HEIC as application/octet-stream — check extension too
const ACCEPTED = ['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','application/octet-stream'];

interface Props {
  objectId: string;
  objectTitle?: string;
}

export const PhotoUpload: React.FC<Props> = ({ objectId, objectTitle }) => {
  const [type, setType] = useState<PhotoType>('daily');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const { user, uid } = useAuth();
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const f = e.target.files?.[0];
    if (!f) return;

    const isImage = ACCEPTED.includes(f.type) || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name);
    if (!isImage) {
      setError('Ungültiges Format. Nur Bilder (JPG, PNG, HEIC…) erlaubt.');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('Datei zu groß. Bitte Bild unter 50 MB wählen.');
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);

    // reset input so same file can be picked again
    e.target.value = '';
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file || !uid || !user) return;
    setError('');

    if (!navigator.onLine) {
      setError('Kein Internet. Bitte stelle eine Verbindung her und versuche es erneut.');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await uploadPhoto(objectId, file, type, caption, uid, user.name, setProgress, objectTitle);
      clearFile();
      setCaption('');
      setProgress(0);
      toast.success('Foto hochgeladen');
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      console.error('[PhotoUpload] failed:', err);
      if (msg.includes('permission') || msg.includes('unauthorized')) {
        setError('Keine Berechtigung zum Hochladen.');
      } else if (msg.includes('quota') || msg.includes('size')) {
        setError('Datei zu groß für den Speicher.');
      } else {
        setError(`Upload fehlgeschlagen: ${msg || 'Bitte erneut versuchen.'}`);
      }
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const statusLabel = progress === 0
    ? 'Bild wird komprimiert…'
    : `Hochladen… ${progress}%`;

  return (
    <div>
      {!file && (
        <PickerRow>
          <PickerBtn htmlFor="photo-camera">
            <HiddenInput
              id="photo-camera"
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
            <FiCamera size={15} />
            Kamera
          </PickerBtn>

          <PickerBtn htmlFor="photo-gallery">
            <HiddenInput
              id="photo-gallery"
              ref={galleryRef}
              type="file"
              accept="image/*,image/heic,image/heif"
              onChange={handleFileChange}
            />
            <FiImage size={15} />
            Galerie
          </PickerBtn>
        </PickerRow>
      )}

      {preview && (
        <PreviewBox>
          <Preview src={preview} alt="Vorschau" />
          {!uploading && <ClearBtn onClick={clearFile}><FiX size={11} /></ClearBtn>}
        </PreviewBox>
      )}

      {uploading && (
        <>
          <ProgressBar $progress={progress} />
          <UploadingLabel>{statusLabel}</UploadingLabel>
        </>
      )}

      {error && <ErrorBox>{error}</ErrorBox>}

      {file && !uploading && (
        <Row>
          <FormGroup style={{ flexShrink: 0, width: 110 }}>
            <Label>Typ</Label>
            <Select value={type} onChange={(e) => setType(e.target.value as PhotoType)}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup style={{ flex: 1, minWidth: 0 }}>
            <Label>Beschriftung (optional)</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Kurze Beschreibung…"
              onKeyDown={(e) => e.key === 'Enter' && handleUpload()}
            />
          </FormGroup>
          <Button onClick={handleUpload} disabled={uploading} style={{ flexShrink: 0, alignSelf: 'flex-end' }}>
            Hochladen
          </Button>
        </Row>
      )}
    </div>
  );
};
