import React, { useState } from 'react';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { useToast } from '@shared/ui/Toast';
import { createUser, updateUserName } from '@shared/services/authService';
import type { AppUser, UserRole } from '@shared/types';
import { Form, FormActions, ErrorMsg } from './UserModals.styles';

interface EditNameModalProps {
  user: AppUser | null;
  onClose: () => void;
  onSaved: () => void;
}

export const EditNameModal: React.FC<EditNameModalProps> = ({ user, onClose, onSaved }) => {
  const [editName, setEditName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editName.trim()) return;
    setSaving(true);
    try {
      await updateUserName(user.uid, editName.trim());
      onSaved();
      toast.success('Name aktualisiert');
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={!!user} onClose={onClose} title="Name bearbeiten">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name *</Label>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Vor- und Nachname"
            required
          />
        </FormGroup>
        <FormActions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Speichern…' : 'Speichern'}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
};

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (name: string) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    onClose();
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createUser(name, email, password, role);
      const createdName = name;
      setName('');
      setEmail('');
      setPassword('');
      setRole('worker');
      handleClose();
      onCreated(createdName);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('email-already-in-use')) {
        setError('Diese E-Mail ist bereits registriert.');
      } else {
        setError('Fehler beim Anlegen des Benutzers.');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Neuen Benutzer anlegen">
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <FormGroup>
          <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vor- und Nachname"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>E-Mail *</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Passwort *</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mindestens 6 Zeichen"
            minLength={6}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Rolle</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="worker">Mitarbeiter</option>
            <option value="admin">Admin</option>
          </Select>
        </FormGroup>
        <FormActions>
          <Button type="button" $variant="secondary" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={creating}>
            {creating ? 'Anlegen…' : 'Benutzer anlegen'}
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
};
