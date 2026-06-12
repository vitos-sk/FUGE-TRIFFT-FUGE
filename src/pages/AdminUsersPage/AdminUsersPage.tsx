import React, { useState, useEffect } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { getAllUsers, toggleUserDisabled } from '@shared/services/authService';
import { useAuth } from '@shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { Button } from '@shared/ui/Button';
import { Spinner } from '@shared/ui/Spinner';
import type { AppUser } from '@shared/types';
import { UsersTable } from './components/UsersTable';
import { EditNameModal, CreateUserModal } from './components/UserModals';
import { PageTitle, TableHeader, UserCount, LoadingWrapper } from './AdminUsersPage.styles';

const AdminUsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    const all = await getAllUsers();
    setUsers(all.sort((a, b) => a.name.localeCompare(b.name)));
    setLoading(false);
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
    return (
      <LoadingWrapper>
        <Spinner size={32} />
      </LoadingWrapper>
    );
  }

  return (
    <>
      <PageTitle>Benutzerverwaltung</PageTitle>

      <TableHeader>
        <UserCount>{users.length} Benutzer</UserCount>
        <Button $variant="secondary" onClick={() => setShowCreateModal(true)}>
          <FiUserPlus size={15} />
          Neuen Benutzer
        </Button>
      </TableHeader>

      <UsersTable
        users={users}
        onEdit={(user) => setEditingUser(user)}
        onToggle={handleToggle}
      />

      <EditNameModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={() => { setEditingUser(null); loadUsers(); }}
      />

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(name) => { loadUsers(); toast.success(`Benutzer „${name}" erstellt`); }}
      />
    </>
  );
};

export default AdminUsersPage;
