import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { format, isPast, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiAlertTriangle, FiMessageSquare, FiCheckSquare, FiCalendar } from 'react-icons/fi';
import type { CRMObject } from '../../types';

const statusColor: Record<string, string> = {
  new: '#2563eb',
  in_progress: '#cc2222',
  paused: '#6b6b6b',
  done: '#22a35a',
};

const statusLabels: Record<string, string> = {
  new: 'Neu',
  in_progress: 'In Arbeit',
  paused: 'Pausiert',
  done: 'Fertig',
};

const Card = styled.div<{ $status: string }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.spring};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* colored top accent bar */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $status }) => statusColor[$status] || '#333'};
    border-radius: ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0 0;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    background: #1c1c1c;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const CardHeader = styled.div`
  padding: 18px 18px 0;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  flex: 1;
`;

const StatusPill = styled.span<{ $status: string }>`
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $status }) => statusColor[$status] || '#777'};
  background: ${({ $status }) => statusColor[$status] || '#333'}1a;
  border: 1px solid ${({ $status }) => statusColor[$status] || '#333'}40;
  border-radius: 9999px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
`;

const Location = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  line-height: 1.4;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 18px;
`;

const CardBody = styled.div`
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const MetaItem = styled.div<{ $warn?: boolean; $ok?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  ${({ $warn, theme }) => $warn && css`color: ${theme.colors.accent};`}
  ${({ $ok }) => $ok && css`color: #22a35a;`}
  ${({ $warn, $ok, theme }) => !$warn && !$ok && css`color: ${theme.colors.textMuted};`}
`;

const NoteCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  padding: 3px 10px;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${Card}:hover & {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const ChecklistBar = styled.div`
  margin-top: 2px;
`;

const ChecklistLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

const ProgressTrack = styled.div`
  height: 3px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number; $done: boolean }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $done }) => $done ? '#22a35a' : '#cc2222'};
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

const LastNote = styled.div`
  margin-top: 2px;
  padding: 9px 12px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 ${({ theme }) => theme.borderRadiusSm} ${({ theme }) => theme.borderRadiusSm} 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LastNoteAuthor = styled.span`
  font-style: normal;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: 4px;
`;

interface Props {
  object: CRMObject;
}

export const ObjectCard: React.FC<Props> = ({ object }) => {
  const navigate = useNavigate();

  const deadline = object.deadline?.toDate?.();
  const isOverdue = deadline ? isPast(deadline) && object.status !== 'done' : false;
  const isSoon = deadline && !isOverdue
    ? differenceInDays(deadline, new Date()) <= 3 && object.status !== 'done'
    : false;

  const checklist = object.checklist ?? [];
  const checkTotal = checklist.length;
  const checkDone = checklist.filter((c) => c.done).length;
  const checkPct = checkTotal > 0 ? Math.round((checkDone / checkTotal) * 100) : 0;
  const allDone = checkTotal > 0 && checkDone === checkTotal;

  return (
    <Card $status={object.status} onClick={() => navigate(`/objects/${object.id}`)}>
      <CardHeader>
        <CardTop>
          <Title>{object.title}</Title>
          <StatusPill $status={object.status}>{statusLabels[object.status]}</StatusPill>
        </CardTop>
        <Location>
          <FiMapPin size={12} style={{ flexShrink: 0 }} />
          {object.address}, {object.city}
        </Location>
      </CardHeader>

      <Divider />

      <CardBody>
        <MetaRow>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {deadline && (
              <MetaItem $warn={isOverdue} $ok={!isOverdue && !isSoon && object.status === 'done'}>
                {isOverdue
                  ? <FiAlertTriangle size={12} />
                  : <FiCalendar size={12} />
                }
                {format(deadline, 'dd. MMM yy', { locale: de })}
              </MetaItem>
            )}
          </div>

          {(object.noteCount ?? 0) > 0 && (
            <NoteCount>
              <FiMessageSquare size={11} />
              {object.noteCount}
            </NoteCount>
          )}
        </MetaRow>

        {checkTotal > 0 && (
          <ChecklistBar>
            <ChecklistLabel>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiCheckSquare size={10} />
                Checkliste
              </span>
              <span>{checkDone}/{checkTotal}</span>
            </ChecklistLabel>
            <ProgressTrack>
              <ProgressFill $pct={checkPct} $done={allDone} />
            </ProgressTrack>
          </ChecklistBar>
        )}

        {object.lastNoteText && (
          <LastNote>
            {object.lastNoteAuthor && (
              <LastNoteAuthor>{object.lastNoteAuthor.split(' ')[0]}:</LastNoteAuthor>
            )}
            {object.lastNoteText}
          </LastNote>
        )}
      </CardBody>
    </Card>
  );
};
