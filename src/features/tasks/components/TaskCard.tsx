import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiUser, FiCalendar, FiEdit2, FiCheck } from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';
import { useAuth } from '@features/auth/hooks';
import { TASK_STATUS } from '@constants';
import type { Task, CRMObject } from '@shared/types';
import {
  Card,
  Title,
  MetaCol,
  MetaItem,
  Description,
  ActionsRow,
  ActionBtn,
  WhatsAppBtn,
} from './TaskCard.styles';

interface Props {
  task: Task;
  object?: CRMObject | null;
  workerName?: string;
  onEdit?: (task: Task) => void;
  onComplete?: (task: Task) => void;
}

export const TaskCard: React.FC<Props> = ({ task, object, workerName, onEdit, onComplete }) => {
  const { isAdmin, uid } = useAuth();

  const title = task.objectId
    ? object
      ? `${object.address}, ${object.city}`
      : '…'
    : task.customLocation || '—';

  const startAt = task.startAt?.toDate?.();
  const canComplete = task.status !== TASK_STATUS.DONE && (isAdmin || uid === task.workerId);
  const showWhatsApp = !!task.objectId && !!object?.whatsappLink;

  return (
    <Card $status={task.status}>
      <Title>{title}</Title>

      <MetaCol>
        {workerName && (
          <MetaItem>
            <FiUser size={12} />
            {workerName}
          </MetaItem>
        )}
        {startAt && (
          <MetaItem>
            <FiCalendar size={12} />
            {format(startAt, 'dd. MMM yy, HH:mm', { locale: de })}
          </MetaItem>
        )}
      </MetaCol>

      {task.description && <Description>{task.description}</Description>}

      {(isAdmin || canComplete || showWhatsApp) && (
        <ActionsRow>
          {showWhatsApp && (
            <WhatsAppBtn href={object!.whatsappLink} target="_blank" rel="noopener noreferrer">
              <SiWhatsapp size={13} color="#25D366" />
              WhatsApp
            </WhatsAppBtn>
          )}
          {isAdmin && (
            <ActionBtn type="button" $variant="secondary" onClick={() => onEdit?.(task)}>
              <FiEdit2 size={13} />
              Bearbeiten
            </ActionBtn>
          )}
          {canComplete && (
            <ActionBtn type="button" $variant="success" onClick={() => onComplete?.(task)}>
              <FiCheck size={14} />
              Erledigt
            </ActionBtn>
          )}
        </ActionsRow>
      )}
    </Card>
  );
};
