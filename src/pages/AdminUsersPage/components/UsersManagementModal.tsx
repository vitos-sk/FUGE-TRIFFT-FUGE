import React, { useState, useEffect } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { getAllUsers, toggleUserDisabled } from '@features/auth/services';
import { useToast } from '@shared/ui/Toast';
import { useConfirm } from '@shared/ui/ConfirmDialog';
import { Button } from '@shared/ui/Button';
import { Loader } from '@shared/ui/Loader';
import { Modal } from '@shared/ui/Modal';
import type { AppUser } from '@shared/types';
import { UsersTable } from './UsersTable';
import { EditNameModal, CreateUserModal } from './UserModals';
import { TableHeader, UserCount } from '../AdminUsersPage.styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const UsersManagementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (isOpen) loadUsers();
  }, [isOpen]);

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Benutzerverwaltung" width="960px">
        <TableHeader>
          <UserCount>{users.length} Benutzer</UserCount>
          <Button $variant="secondary" onClick={() => setShowCreateModal(true)}>
            <FiUserPlus size={15} />
            Neuen Benutzer
          </Button>
        </TableHeader>

        {loading ? (
          <Loader />
        ) : (
          <UsersTable
            users={users}
            onEdit={(user) => setEditingUser(user)}
            onToggle={handleToggle}
          />
        )}
      </Modal>

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
