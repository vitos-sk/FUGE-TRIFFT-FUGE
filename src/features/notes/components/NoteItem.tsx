import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiTrash2, FiEdit2, FiCheck, FiX, FiMoreVertical } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Textarea } from '@shared/ui/Input';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { deleteNote, updateNote } from '@features/notes/services';
import type { Note } from '@shared/types';
import {
  Row,
  Avatar,
  Column,
  MetaRow,
  Author,
  Time,
  MenuBtn,
  Bubble,
  EditBox,
  EditRow,
  SheetActions,
  SheetAction,
} from './NoteItem.styles';

const MAX_CHARS = 600;

/** "Vitalii Schmidt" → "VS", "Dmitriy" → "DM" */
const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

interface Props {
  note: Note;
  objectId: string;
  uid: string;
  isAdmin: boolean;
  highlighted?: boolean;
}

export const NoteItem: React.FC<Props> = ({ note, objectId, uid, isAdmin, highlighted }) => {
  const isOwn = note.authorId === uid;
  const canEdit = isAdmin || isOwn;

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    if (!highlighted) return;
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlighted]);

  const handleDelete = async () => {
    setMenuOpen(false);
    const ok = await confirm({
      title: 'Nachricht löschen',
      message: 'Diese Nachricht wirklich löschen?',
      confirmLabel: 'Löschen',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteNote(objectId, note.id);
      toast.success('Nachricht gelöscht');
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const handleSave = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await updateNote(objectId, note.id, editText.trim(), note.tag);
      toast.success('Nachricht aktualisiert');
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

  const createdAt = note.createdAt?.toDate?.() ?? null;

  return (
    <Row ref={itemRef} $isOwn={isOwn}>
      <Avatar $isOwn={isOwn}>{initials(note.authorName || '?')}</Avatar>

      <Column $isOwn={isOwn}>
        <MetaRow>
          <Author>{note.authorName}</Author>
          <Time>{createdAt ? format(createdAt, 'HH:mm', { locale: de }) : ''}</Time>
          {canEdit && !editing && (
            <MenuBtn
              onClick={() => setMenuOpen(true)}
              title="Optionen"
              aria-label="Nachrichten-Optionen"
            >
              <FiMoreVertical size={14} />
            </MenuBtn>
          )}
        </MetaRow>

        {editing ? (
          <EditBox>
            <Textarea
              value={editText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setEditText(e.target.value);
              }}
              rows={3}
              autoFocus
              style={{ width: '100%', fontSize: 14 }}
            />
            <EditRow>
              <Button
                $size="sm"
                $variant="secondary"
                onClick={handleCancelEdit}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <FiX size={13} /> Abbrechen
              </Button>
              <Button
                $size="sm"
                onClick={handleSave}
                disabled={saving || !editText.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <FiCheck size={13} /> {saving ? 'Speichern…' : 'Speichern'}
              </Button>
            </EditRow>
          </EditBox>
        ) : (
          <Bubble $isOwn={isOwn} $highlighted={highlighted}>
            {note.text}
          </Bubble>
        )}
      </Column>

      <BottomSheet
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Nachricht"
      >
        <SheetActions>
          <SheetAction
            onClick={() => {
              setMenuOpen(false);
              setEditText(note.text);
              setEditing(true);
            }}
          >
            <FiEdit2 size={17} />
            Bearbeiten
          </SheetAction>
          <SheetAction $danger onClick={handleDelete}>
            <FiTrash2 size={17} />
            Löschen
          </SheetAction>
        </SheetActions>
      </BottomSheet>
    </Row>
  );
};
