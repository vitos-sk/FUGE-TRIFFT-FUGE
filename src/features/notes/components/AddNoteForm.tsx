import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Textarea, Select, FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { addNote } from '@shared/services/notesService';
import { useAuth } from '@shared/hooks/useAuth';
import { useToast } from '@shared/ui/Toast';
import { useAuthContext } from '@shared/context/AuthContext';
import type { NoteTag } from '@shared/types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Templates = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.button`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }
  &:active { transform: scale(0.97); }
`;

const TextareaWrapper = styled.div`
  position: relative;
`;

const CharCount = styled.span<{ $warn: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 10px;
  color: ${({ $warn, theme }) => $warn ? theme.colors.accent : theme.colors.textMuted};
  pointer-events: none;
  transition: color 0.15s;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const Hint = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: -6px;
`;

const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
`;

const TEMPLATES = [
  'Kleber fehlt',
  'Fliesen fehlen',
  'Müll abholen',
  'Werkzeug vergessen',
  'Fertig für heute',
];

const TAG_OPTIONS: { value: NoteTag; label: string }[] = [
  { value: 'general',  label: 'Allgemein' },
  { value: 'material', label: 'Material' },
  { value: 'delivery', label: 'Lieferung' },
  { value: 'garbage',  label: 'Müll' },
  { value: 'problem',  label: 'Problem' },
];

const MAX_CHARS = 600;

interface Props {
  objectId: string;
  objectTitle?: string;
}

export const AddNoteForm: React.FC<Props> = ({ objectId, objectTitle }) => {
  const [text, setText] = useState('');
  const [tag, setTag] = useState<NoteTag>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, uid } = useAuth();
  const { firebaseUser } = useAuthContext();
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const authorName = user?.name || firebaseUser?.displayName || firebaseUser?.email || uid || 'Unbekannt';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) return;

    if (!uid) {
      setError('Nicht angemeldet. Bitte neu einloggen.');
      return;
    }

    setLoading(true);
    try {
      await addNote(objectId, text.trim(), tag, uid, authorName, objectTitle);
      setText('');
      setTag('general');
      toast.success('Notiz hinzugefügt');
      textareaRef.current?.focus();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      console.error('[AddNoteForm] addNote failed:', err);
      if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
        setError('Keine Berechtigung. Bitte neu einloggen.');
      } else if (msg.includes('offline') || msg.includes('network') || msg.includes('unavailable')) {
        setError('Keine Verbindung. Bitte prüfe das Internet.');
      } else {
        setError('Fehler beim Speichern. Bitte erneut versuchen.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() && !loading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const charsLeft = MAX_CHARS - text.length;
  const nearLimit = charsLeft < 60;

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}

      <FormGroup>
        <Label>Schnellvorlagen</Label>
        <Templates>
          {TEMPLATES.map((t) => (
            <Chip key={t} type="button" onClick={() => { setText(t); textareaRef.current?.focus(); }}>
              {t}
            </Chip>
          ))}
        </Templates>
      </FormGroup>

      <FormGroup>
        <Label>Notiz</Label>
        <TextareaWrapper>
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setText(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder="Notiz eingeben…"
            rows={3}
            style={{ paddingBottom: 24 }}
          />
          {text.length > 0 && (
            <CharCount $warn={nearLimit}>{charsLeft}</CharCount>
          )}
        </TextareaWrapper>
        <Hint>Ctrl + Enter zum schnellen Absenden</Hint>
      </FormGroup>

      <Row>
        <div style={{ flex: 1 }}>
          <Select value={tag} onChange={(e) => setTag(e.target.value as NoteTag)}>
            {TAG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <Button type="submit" disabled={!text.trim() || loading || text.length > MAX_CHARS}>
          {loading ? 'Senden…' : 'Notiz hinzufügen'}
        </Button>
      </Row>
    </Form>
  );
};
