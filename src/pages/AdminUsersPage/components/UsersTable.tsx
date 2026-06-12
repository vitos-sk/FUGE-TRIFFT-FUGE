import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiEdit2 } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import type { AppUser, UserRole } from '@shared/types';
import { ROLE } from '../../../constants';
import {
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  ActionCell,
  StatusDot,
  TdBold,
  TdMuted,
  RoleBadge,
} from './UsersTable.styles';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  worker: 'Mitarbeiter',
};

interface UsersTableProps {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onToggle: (user: AppUser) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onToggle }) => (
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
            <TdBold>{user.name}</TdBold>
            <TdMuted $hide>{user.email}</TdMuted>
            <Td>
              <RoleBadge $isAdmin={user.role === ROLE.ADMIN}>
                {roleLabels[user.role]}
              </RoleBadge>
            </Td>
            <TdMuted $hide>
              {user.createdAt?.toDate?.()
                ? format(user.createdAt.toDate(), 'dd.MM.yyyy', { locale: de })
                : '—'}
            </TdMuted>
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
                  onClick={() => onEdit(user)}
                  title="Name bearbeiten"
                >
                  <FiEdit2 size={14} />
                </Button>
                <Button
                  $variant="secondary"
                  $size="sm"
                  onClick={() => onToggle(user)}
                >
                  {user.disabled ? 'Aktivieren' : 'Deaktiv.'}
                </Button>
              </ActionCell>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  </TableWrapper>
);
