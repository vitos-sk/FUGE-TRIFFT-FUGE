import React, { useRef, useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiEdit2 } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import type { AppUser, UserRole } from '@shared/types';
import { ROLE } from '../../../constants';
import {
  Outer,
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
  ScrollTrack,
  ScrollThumb,
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

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onToggle }) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbState, setThumbState] = useState({ left: 0, width: 100 });
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateThumb = useCallback(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    const ratio = el.clientWidth / el.scrollWidth;
    const overflows = ratio < 0.999;
    setHasOverflow(overflows);
    if (!overflows) return;
    const thumbW = Math.max(ratio * 100, 8);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollRatio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setThumbState({ left: scrollRatio * (100 - thumbW), width: thumbW });
  }, []);

  useEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateThumb, { passive: true });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    updateThumb();
    return () => { el.removeEventListener('scroll', updateThumb); ro.disconnect(); };
  }, [updateThumb]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const el = tableWrapperRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = tableWrapperRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    const trackW = thumb.parentElement!.clientWidth;
    const thumbW = thumb.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    thumb.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      el.scrollLeft = startScroll + (dx / (trackW - thumbW)) * maxScroll;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <Outer>
      <TableWrapper ref={tableWrapperRef}>
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
      {hasOverflow && (
        <ScrollTrack onClick={handleTrackClick}>
          <ScrollThumb
            ref={thumbRef}
            style={{ left: `${thumbState.left}%`, width: `${thumbState.width}%` }}
            onPointerDown={handleThumbPointerDown}
          />
        </ScrollTrack>
      )}
    </Outer>
  );
};
