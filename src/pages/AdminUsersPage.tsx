import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiEdit2, FiUserPlus } from 'react-icons/fi';
import { Modal } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { Input, Select, FormGroup, Label } from '@shared/ui/Input';
import { Badge } from '@shared/ui/Badge';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { getAllUsers, createUser, toggleUserDisabled, updateUserName } from '@shared/services/authService';
import { useAuth } from '@shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { AppUser, UserRole } from '@shared/types';
import { Spinner } from '@shared/ui/Spinner';

const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const UserCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 480px;
`;

const Th = styled.th<{ $hide?: boolean }>`
  padding: 11px 14px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;

  @media (max-width: 600px) {
    display: ${({ $hide }) => $hide ? 'none' : 'table-cell'};
    padding: 10px 10px;
  }
`;

const Td = styled.td<{ $hide?: boolean }>`
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;

  @media (max-width: 600px) {
    display: ${({ $hide }) => $hide ? 'none' : 'table-cell'};
    padding: 10px 10px;
  }
`;

const Tr = styled.tr<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  transition: background ${({ theme }) => theme.transitions.fast};
  &:last-child td { border-bottom: none; }
  &:hover td { background: ${({ theme }) => theme.colors.bgElevated}; }
`;

const ActionCell = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 400px) {
    flex-direction: column-reverse;
    button { width: 100%; }
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
  padding: 11px 14px;
  background: ${({ theme }) => `${theme.colors.danger}18`};
  border: 1px solid ${({ theme }) => `${theme.colors.danger}44`};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  line-height: 1.4;
`;

const StatusDot = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $active }) => $active ? '#27ae60' : '#6c757d'};
  white-space: nowrap;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
`;

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  worker: 'Mitarbeiter',
};

const AdminUsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('worker');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    const all = await getAllUsers();
    setUsers(all.sort((a, b) => a.name.localeCompare(b.name)));
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await createUser(name, email, password, role);
      setShowModal(false);
      setName(''); setEmail(''); setPassword(''); setRole('worker');
      await loadUsers();
      toast.success(`Benutzer "${name}" erstellt`);
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

  const handleEditName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim()) return;
    setEditSaving(true);
    try {
      await updateUserName(editingUser.uid, editName.trim());
      await loadUsers();
      setEditingUser(null);
      toast.success('Name aktualisiert');
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleToggle = async (user: AppUser) => {
    const action = user.disabled ? 'aktivieren' : 'deaktivieren';
    const ok = await confirm({
      title: `Benutzer ${action}`,
      message: `${user.name} wirklich ${action}?`,
      confirmLabel: user.disabled ? 'Aktivieren' : 'Deaktivieren',
      danger: !user.disabled,
    });
    if (!ok) return;
    try {
      await toggleUserDisabled(user.uid, !user.disabled);
      await loadUsers();
      toast.success(`${user.name} ${user.disabled ? 'aktiviert' : 'deaktiviert'}`);
    } catch {
      toast.error('Fehler beim Aktualisieren.');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>;
  }

  return (
    <>
      <PageTitle>Benutzerverwaltung</PageTitle>

      <TableHeader>
        <UserCount>{users.length} Benutzer</UserCount>
        <Button $variant="secondary" onClick={() => setShowModal(true)}>
          <FiUserPlus size={15} />
          Neuen Benutzer
        </Button>
      </TableHeader>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th $hide>E-Mail</Th>
              <Th>Rolle</Th>
              <Th $hide>Erstellt</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <Tr key={user.uid} $disabled={user.disabled}>
                <Td style={{ fontWeight: 500 }}>{user.name}</Td>
                <Td $hide style={{ color: '#8a8a8a' }}>{user.email}</Td>
                <Td>
                  <Badge
                    style={{
                      background: user.role === 'admin' ? '#c9a84c1a' : '#3498db1a',
                      color: user.role === 'admin' ? '#c9a84c' : '#3498db',
                      border: `1px solid ${user.role === 'admin' ? '#c9a84c35' : '#3498db35'}`,
                    }}
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </Td>
                <Td $hide style={{ color: '#8a8a8a' }}>
                  {user.createdAt?.toDate?.()
                    ? format(user.createdAt.toDate(), 'dd.MM.yyyy', { locale: de })
                    : '—'}
                </Td>
                <Td>
                  <StatusDot $active={!user.disabled}>
                    {user.disabled ? 'Deakt.' : 'Aktiv'}
                  </StatusDot>
                </Td>
                <Td>
                  <ActionCell>
                    <Button
                      $variant="ghost"
                      $size="sm"
                      onClick={() => { setEditingUser(user); setEditName(user.name); }}
                      title="Name bearbeiten"
                    >
                      <FiEdit2 size={14} />
                    </Button>
                    <Button $variant="secondary" $size="sm" onClick={() => handleToggle(user)}>
                      {user.disabled ? 'Aktivieren' : 'Deaktiv.'}
                    </Button>
                  </ActionCell>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Edit name modal */}
      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Name bearbeiten">
        <Form onSubmit={handleEditName}>
          <FormGroup>
            <Label>Name *</Label>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Vor- und Nachname" required />
          </FormGroup>
          <FormActions>
            <Button type="button" $variant="secondary" onClick={() => setEditingUser(null)}>Abbrechen</Button>
            <Button type="submit" disabled={editSaving}>{editSaving ? 'Speichern…' : 'Speichern'}</Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Create user modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Neuen Benutzer anlegen">
        <Form onSubmit={handleCreate}>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <FormGroup>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vor- und Nachname" required />
          </FormGroup>
          <FormGroup>
            <Label>E-Mail *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@beispiel.de" required />
          </FormGroup>
          <FormGroup>
            <Label>Passwort *</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mindestens 6 Zeichen" minLength={6} required />
          </FormGroup>
          <FormGroup>
            <Label>Rolle</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="worker">Mitarbeiter</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>
          <FormActions>
            <Button type="button" $variant="secondary" onClick={() => { setShowModal(false); setError(''); }}>Abbrechen</Button>
            <Button type="submit" disabled={creating}>{creating ? 'Anlegen…' : 'Benutzer anlegen'}</Button>
          </FormActions>
        </Form>
      </Modal>
    </>
  );
};

export default AdminUsersPage;
