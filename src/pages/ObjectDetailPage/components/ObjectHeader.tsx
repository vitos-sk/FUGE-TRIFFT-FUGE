import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { SiGooglemaps } from 'react-icons/si';
import { Badge } from '@shared/ui/Badge';
import type { CRMObject } from '@shared/types';
import {
  BackLink,
  PageHeader,
  TitleRow,
  Title,
  Meta,
  HeaderActions,
  MapsBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
  statusLabels: Record<string, string>;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object, statusLabels }) => (
  <>
    <BackLink to="/objects">← Zurück zur Übersicht</BackLink>
    <PageHeader>
      <TitleRow>
        <div>
          <Title>{object.title}</Title>
          <Meta>
            <FiMapPin size={12} />
            {object.address}, {object.city}
          </Meta>
        </div>
        <HeaderActions>
          <Badge $status={object.status}>{statusLabels[object.status]}</Badge>
          <MapsBtn
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${object.address}, ${object.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGooglemaps size={15} color="#EA4335" />
            Google Maps
          </MapsBtn>
        </HeaderActions>
      </TitleRow>
    </PageHeader>
  </>
);
