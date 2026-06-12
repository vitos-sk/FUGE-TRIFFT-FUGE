import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import type { CRMObject } from '@shared/types';
import {
  ArchivedCard,
  CardHeader,
  CardTop,
  CardTitle,
  ArchivedBadge,
  Location,
  Divider,
  CardFooter,
  ArchivedDate,
  CardActions,
  DangerBtn,
} from './ArchiveCard.styles';

interface ArchiveCardProps {
  object: CRMObject;
  onRestore: (obj: CRMObject) => void;
  onDelete: (obj: CRMObject) => void;
  isAdmin: boolean;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ object, onRestore, onDelete, isAdmin }) => {
  const archivedDate = object.archivedAt?.toDate?.();

  return (
    <ArchivedCard>
      <CardHeader>
        <CardTop>
          <CardTitle>{object.title}</CardTitle>
          <ArchivedBadge>Archiviert</ArchivedBadge>
        </CardTop>
        <Location>
          <FiMapPin size={12} />
          {object.address}, {object.city}
        </Location>
      </CardHeader>
      <Divider />
      <CardFooter>
        <ArchivedDate>
          {archivedDate ? format(archivedDate, 'dd. MMM yyyy', { locale: de }) : '—'}
        </ArchivedDate>
        {isAdmin && (
          <CardActions>
            <Button $variant="secondary" $size="sm" onClick={() => onRestore(object)}>
              <FiRotateCcw size={13} />
              Wiederherstellen
            </Button>
            <DangerBtn $variant="ghost" $size="sm" onClick={() => onDelete(object)}>
              <FiTrash2 size={13} />
              Löschen
            </DangerBtn>
          </CardActions>
        )}
      </CardFooter>
    </ArchivedCard>
  );
};
