import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMessageSquare, FiBox, FiTruck, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { Badge } from '../ui/Badge';
import type { Note, NoteTag } from '../../types';

const Item = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};
  border-radius: 0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255,255,255,0.02);
  }
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

const tagMeta: Record<NoteTag, { icon: React.ReactNode; label: string }> = {
  general:  { icon: <FiMessageSquare size={11} />, label: 'Allgemein' },
  material: { icon: <FiBox size={11} />,           label: 'Material' },
  delivery: { icon: <FiTruck size={11} />,         label: 'Lieferung' },
  garbage:  { icon: <FiTrash2 size={11} />,        label: 'Müll' },
  problem:  { icon: <FiAlertTriangle size={11} />, label: 'Problem' },
};

interface Props {
  note: Note;
}

export const NoteItem: React.FC<Props> = ({ note }) => (
  <Item>
    <Header>
      <Badge tag={note.tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {tagMeta[note.tag].icon}{tagMeta[note.tag].label}
      </Badge>
      <Author>{note.authorName}</Author>
      <Time>
        {note.createdAt?.toDate
          ? format(note.createdAt.toDate(), 'dd.MM.yy HH:mm', { locale: de })
          : ''}
      </Time>
    </Header>
    <Text>{note.text}</Text>
  </Item>
);
