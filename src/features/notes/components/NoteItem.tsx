import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Textarea } from '@shared/ui/Input';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { deleteNote, updateNote } from '@shared/services/notesService';
import type { Note } from '@shared/types';

const flashHighlight = keyframes`
  0%   { background: rgba(204,34,34,0.18); }
  60%  { background: rgba(204,34,34,0.10); }
  100% { background: transparent; }
`;

const Item = styled.div<{ $highlighted?: boolean }>`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};
  animation: ${({ $highlighted }) => $highlighted ? flashHighlight : 'none'} 0.9s ease-out;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(255,255,255,0.02); }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Author = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Time = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
`;

const Text = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 2px;
  margin-left: 6px;
  flex-shrink: 0;
`;

const EditRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const MAX_CHARS = 600;

interface Props {
  note: Note;
  objectId: string;
  uid: string;
  isAdmin: boolean;
  highlighted?: boolean;
}

export const NoteItem: React.FC<Props> = ({ note, objectId, uid, isAdmin, highlighted }) => {
  const canEdit = isAdmin || note.authorId === uid;

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [saving, setSaving] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    if (!highlighted) return;
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlighted]);

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Notiz löschen',
      message: 'Diese Notiz wirklich löschen?',
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteNote(objectId, note.id);
      toast.success('Notiz gelöscht');
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const handleSave = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await updateNote(objectId, note.id, editText.trim(), note.tag);
      toast.success('Notiz aktualisiert');
      setEditing(false);
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(note.text);
    setEditing(false);
  };

  return (
    <Item ref={itemRef} $highlighted={highlighted}>
      <Header>
        <Author>{note.authorName}</Author>
        <Time>
          {note.createdAt?.toDate
            ? format(note.createdAt.toDate(), 'dd.MM.yy HH:mm', { locale: de })
            : ''}
        </Time>
        {canEdit && !editing && (
          <Actions>
            <Button
              $variant="ghost"
              $size="sm"
              onClick={() => setEditing(true)}
              title="Bearbeiten"
              style={{ color: '#666', padding: '3px 5px' }}
            >
              <FiEdit2 size={13} />
            </Button>
            <Button
              $variant="ghost"
              $size="sm"
              onClick={handleDelete}
              title="Löschen"
              style={{ color: '#666', padding: '3px 5px' }}
            >
              <FiTrash2 size={13} />
            </Button>
          </Actions>
        )}
      </Header>

      {editing ? (
        <>
          <Textarea
            value={editText}
            onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setEditText(e.target.value); }}
            rows={3}
            autoFocus
            style={{ width: '100%', fontSize: 14 }}
          />
          <EditRow>
            <Button $size="sm" $variant="secondary" onClick={handleCancelEdit} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FiX size={13} /> Abbrechen
            </Button>
            <Button $size="sm" onClick={handleSave} disabled={saving || !editText.trim()} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <FiCheck size={13} /> {saving ? 'Speichern…' : 'Speichern'}
            </Button>
          </EditRow>
        </>
      ) : (
        <Text>{note.text}</Text>
      )}
    </Item>
  );
};
