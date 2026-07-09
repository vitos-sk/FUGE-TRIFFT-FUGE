import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Textarea } from '@shared/ui/Input';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { deleteNote, updateNote } from '@features/notes/services';
import type { Note } from '@shared/types';
import { Item, Header, Avatar, Author, Time, NoteText, Actions, EditRow, EditIconBtn, DeleteIconBtn } from './NoteItem.styles';

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
    <Item ref={itemRef} $highlighted={highlighted} $isOwn={note.authorId === uid}>
      <Header>
        <Avatar>{note.authorName.charAt(0).toUpperCase()}</Avatar>
        <Author>{note.authorName}</Author>
        <Time>
          {note.createdAt?.toDate
            ? format(note.createdAt.toDate(), 'dd.MM.yy HH:mm', { locale: de })
            : ''}
        </Time>
        {canEdit && !editing && (
          <Actions>
            <EditIconBtn
              $variant="ghost"
              $size="sm"
              onClick={() => setEditing(true)}
              title="Bearbeiten"
            >
              <FiEdit2 size={13} />
            </EditIconBtn>
            <DeleteIconBtn
              $variant="ghost"
              $size="sm"
              onClick={handleDelete}
              title="Löschen"
            >
              <FiTrash2 size={13} />
            </DeleteIconBtn>
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
        <NoteText>{note.text}</NoteText>
      )}
    </Item>
  );
};
