import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiCamera, FiX } from 'react-icons/fi';
import { uploadPhoto } from '../../services/photosService';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Select, FormGroup, Label, Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import type { PhotoType } from '../../types';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

const Zone = styled.div<{ $active: boolean; $hasFile: boolean }>`
  border: 2px dashed ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ $hasFile }) => $hasFile ? '12px' : '32px'};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.spring};
  background: ${({ $active, theme }) => ($active ? `${theme.colors.accent}0e` : theme.colors.bgCard)};
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => `${theme.colors.accent}08`};
  }
`;

const ZoneIcon = styled.div`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  justify-content: center;
`;

const ZoneText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
`;

const ZoneHint = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  margin-top: 4px;
`;

const PreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Preview = styled.img`
  max-height: 180px;
  max-width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  object-fit: contain;
`;

const ClearBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.bgPrimary};
  cursor: pointer;
  transition: transform 0.15s;

  &:hover { transform: scale(1.1); }
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-top: 14px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  margin-top: 10px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 9999px;
    transition: width 0.4s ease;
  }
`;

const UploadingLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
  text-align: center;
  animation: ${pulse} 1.5s infinite;
`;

const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-top: 10px;
`;

const TYPE_OPTIONS: { value: PhotoType; label: string }[] = [
  { value: 'daily',   label: 'Täglich' },
  { value: 'before',  label: 'Vorher' },
  { value: 'after',   label: 'Nachher' },
  { value: 'problem', label: 'Problem' },
];

interface Props {
  objectId: string;
}

export const PhotoUpload: React.FC<Props> = ({ objectId }) => {
  const [type, setType] = useState<PhotoType>('daily');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const { user, uid } = useAuth();
  const toast = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 15 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted, rejected) => {
      setError('');
      if (rejected.length > 0) {
        const reason = rejected[0].errors[0]?.code;
        if (reason === 'file-too-large') setError('Datei zu groß (max. 15 MB).');
        else setError('Ungültiges Dateiformat. Nur Bilder erlaubt.');
        return;
      }
      const f = accepted[0];
      if (!f) return;
      setFile(f);
      setPreview(URL.createObjectURL(f));
    },
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file || !uid || !user) return;
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      await uploadPhoto(objectId, file, type, caption, uid, user.name, setProgress);
      setFile(null);
      setPreview(null);
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
    ? 'Bild wird vorbereitet…'
    : `Hochladen… ${progress}%`;

  return (
    <div>
      <Zone {...getRootProps()} $active={isDragActive} $hasFile={!!preview}>
        <input {...getInputProps()} capture={undefined} />
        {preview ? (
          <PreviewWrapper>
            <Preview src={preview} alt="Vorschau" />
            {!uploading && <ClearBtn onClick={clearFile}><FiX size={10} /></ClearBtn>}
          </PreviewWrapper>
        ) : (
          <>
            <ZoneIcon><FiCamera size={28} style={{ opacity: 0.5 }} /></ZoneIcon>
            <ZoneText>
              {isDragActive ? 'Datei hier ablegen…' : 'Foto hier ablegen oder klicken'}
            </ZoneText>
            <ZoneHint>JPG, PNG, WEBP · max. 15 MB</ZoneHint>
          </>
        )}
      </Zone>

      {uploading && (
        <>
          <ProgressBar $progress={progress} />
          <UploadingLabel>{statusLabel}</UploadingLabel>
        </>
      )}

      {error && <ErrorBox>{error}</ErrorBox>}

      {file && !uploading && (
        <Row>
          <FormGroup style={{ flex: 1, minWidth: 120 }}>
            <Label>Typ</Label>
            <Select value={type} onChange={(e) => setType(e.target.value as PhotoType)}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup style={{ flex: 2, minWidth: 160 }}>
            <Label>Beschriftung (optional)</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Kurze Beschreibung…"
              onKeyDown={(e) => e.key === 'Enter' && handleUpload()}
            />
          </FormGroup>
          <Button onClick={handleUpload} disabled={uploading} style={{ flexShrink: 0 }}>
            Hochladen
          </Button>
        </Row>
      )}
    </div>
  );
};
