import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { SiGooglemaps } from 'react-icons/si';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  HeroSection,
  HeroGradient,
  HeroBack,
  HeroContent,
  HeroTitle,
  HeroMeta,
  HeroActions,
  MapsIconBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object }) => (
  <>
    <HeroSection>
      <MapPreview
        address={object.address}
        city={object.city}
        height={220}
        borderRadiusTop="0"
        linkToMaps={false}
      />
      <HeroGradient />
      <HeroBack to="/objects">← Zurück</HeroBack>
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
