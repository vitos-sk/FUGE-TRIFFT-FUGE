import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { SiGooglemaps } from 'react-icons/si';
import { Badge } from '@shared/ui/Badge';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  HeroSection,
  HeroGradient,
  HeroBack,
  HeroStatusBadge,
  HeroContent,
  HeroTitle,
  HeroMeta,
  HeroActions,
  MapsIconBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
  statusLabels: Record<string, string>;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object, statusLabels }) => (
  <>
    <HeroSection $status={object.status}>
      <MapPreview
        address={object.address}
        city={object.city}
        height={220}
        borderRadiusTop="0"
        linkToMaps={false}
      />
      <HeroGradient />
      <HeroBack to="/objects">← Zurück</HeroBack>
      <HeroStatusBadge>
        <Badge $status={object.status}>{statusLabels[object.status]}</Badge>
      </HeroStatusBadge>
      <HeroContent>
        <HeroTitle>{object.title}</HeroTitle>
        <HeroMeta>
          <FiMapPin size={11} />
          {object.address}, {object.city}
        </HeroMeta>
      </HeroContent>
    </HeroSection>

    <HeroActions>
      <MapsIconBtn
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${object.address}, ${object.city}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiGooglemaps size={13} color="#EA4335" />
        Google Maps
      </MapsIconBtn>
    </HeroActions>
  </>
);
