import React from 'react';

const NOW = Date.now();
import { FiMapPin, FiClock } from 'react-icons/fi';
import { SiGooglemaps, SiWhatsapp } from 'react-icons/si';
import { format } from 'date-fns';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  HeroSection,
  HeroGradient,
  HeroBack,
  HeroContent,
  HeroTitle,
  HeroMetaRow,
  HeroMeta,
  DeadlineChip,
  HeroActions,
  ActionBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object }) => {
  const deadline = object.deadline?.toDate?.() ?? null;
  const daysUntil = deadline
    ? Math.ceil((deadline.getTime() - NOW) / 86_400_000)
    : null;
  const isUrgent = daysUntil !== null && daysUntil <= 7;

  return (
    <>
      <HeroSection>
        <MapPreview
          address={object.address}
          city={object.city}
          height={320}
          borderRadiusTop="0"
          linkToMaps={false}
        />
        <HeroGradient />
        <HeroBack to="/objects">← Zurück</HeroBack>
        <HeroContent>
          <HeroTitle>{object.title}</HeroTitle>
          <HeroMetaRow>
            <HeroMeta>
              <FiMapPin size={11} />
              {object.address}, {object.city}
            </HeroMeta>
            {deadline && (
              <DeadlineChip $urgent={isUrgent}>
                <FiClock size={9} />
                {format(deadline, 'dd.MM.yy')}
              </DeadlineChip>
            )}
          </HeroMetaRow>
        </HeroContent>
      </HeroSection>

      <HeroActions>
        <ActionBtn
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${object.address}, ${object.city}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGooglemaps size={13} color="#EA4335" />
          Google Maps
        </ActionBtn>

        {object.whatsappLink && (
          <ActionBtn
            href={object.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiWhatsapp size={13} color="#25D366" />
            WhatsApp
          </ActionBtn>
        )}
      </HeroActions>
    </>
  );
};
