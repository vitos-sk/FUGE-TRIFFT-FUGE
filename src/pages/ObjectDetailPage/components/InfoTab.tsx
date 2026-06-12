import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@shared/ui/Button';
import { Badge } from '@shared/ui/Badge';
import type { CRMObject } from '@shared/types';
import {
  InfoGrid,
  InfoItem,
  InfoItemWide,
  InfoLabel,
  InfoValue,
  CopyBtn,
  DangerZone,
  DangerTitle,
} from './InfoTab.styles';

interface InfoTabProps {
  object: CRMObject;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  statusLabels: Record<string, string>;
}

export const InfoTab: React.FC<InfoTabProps> = ({
  object,
  isAdmin,
  onEdit,
  onDelete,
  statusLabels,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(`${object.address}, ${object.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <InfoGrid>
        <InfoItem>
          <InfoLabel>Objektname</InfoLabel>
          <InfoValue>{object.title}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Status</InfoLabel>
          <InfoValue>
            <Badge $status={object.status}>{statusLabels[object.status]}</Badge>
          </InfoValue>
        </InfoItem>
        <InfoItemWide>
          <InfoLabel>Adresse</InfoLabel>
          <InfoValue>
            <span>{object.address}, {object.city}</span>
            <CopyBtn onClick={copyAddress} title="Adresse kopieren">
              {copied ? <FiCheck size={14} color="#22a35a" /> : <FiCopy size={14} />}
            </CopyBtn>
          </InfoValue>
        </InfoItemWide>
        <InfoItem>
          <InfoLabel>Deadline</InfoLabel>
          <InfoValue>
            {object.deadline?.toDate?.()
              ? format(object.deadline.toDate(), 'dd.MM.yyyy', { locale: de })
              : '—'}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Erstellt</InfoLabel>
          <InfoValue>
            {object.createdAt?.toDate?.()
              ? format(object.createdAt.toDate(), 'dd.MM.yyyy', { locale: de })
              : '—'}
          </InfoValue>
        </InfoItem>
      </InfoGrid>

      {isAdmin && (
        <>
          <Button onClick={onEdit}>Bearbeiten</Button>
          <DangerZone>
            <DangerTitle>Gefahrenzone</DangerTitle>
            <Button $variant="danger" onClick={onDelete}>
              Objekt löschen
            </Button>
          </DangerZone>
        </>
      )}
    </div>
  );
};
