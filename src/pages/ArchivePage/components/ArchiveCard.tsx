import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiRotateCcw, FiTrash2, FiCalendar } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  ArchivedCard,
  CardHeader,
  CardTop,
  CardTitle,
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
      <MapPreview address={object.address} city={object.city} height={112} borderRadiusTop="8px" />
      <CardHeader>
        <CardTop>
          <CardTitle>{object.title}</CardTitle>
        </CardTop>
        <Location>
          <FiMapPin size={12} />
          {object.address}, {object.city}
        </Location>
      </CardHeader>
      <Divider />
      <CardFooter>
        <ArchivedDate>
          <FiCalendar size={11} />
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
            </DangerBtn>
          </CardActions>
        )}
      </CardFooter>
    </ArchivedCard>
  );
};
