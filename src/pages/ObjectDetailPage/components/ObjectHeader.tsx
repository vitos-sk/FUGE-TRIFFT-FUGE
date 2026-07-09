import React from 'react';

const NOW = Date.now();
import { FiMapPin, FiClock, FiMoreVertical } from 'react-icons/fi';
import { SiGooglemaps, SiWhatsapp } from 'react-icons/si';
import { format } from 'date-fns';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  HeroSection,
  HeroGradient,
  HeroBack,
  HeroMenuBtn,
  HeroContent,
  HeroTitle,
  HeroMetaRow,
  HeroMeta,
  MapsBtn,
  DeadlineChip,
  HeroActions,
  ActionBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
  onOpenInfo: () => void;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({ object, onOpenInfo }) => {
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
        <HeroMenuBtn onClick={onOpenInfo} aria-label="Objektdetails öffnen">
          <FiMoreVertical size={16} />
        </HeroMenuBtn>
        <HeroContent>
          <HeroTitle>{object.title}</HeroTitle>
          <HeroMetaRow>
            <HeroMeta>
              <FiMapPin size={11} />
              {object.address}, {object.city}
            </HeroMeta>
            <MapsBtn
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${object.address}, ${object.city}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="In Google Maps öffnen"
              aria-label="In Google Maps öffnen"
            >
              <SiGooglemaps size={13} color="#EA4335" />
            </MapsBtn>
            {deadline && (
              <DeadlineChip $urgent={isUrgent}>
                <FiClock size={9} />
                {format(deadline, 'dd.MM.yy')}
              </DeadlineChip>
            )}
          </HeroMetaRow>
        </HeroContent>
      </HeroSection>

      {object.whatsappLink && (
        <HeroActions>
          <ActionBtn
            href={object.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiWhatsapp size={13} color="#25D366" />
            WhatsApp
          </ActionBtn>
        </HeroActions>
      )}
    </>
  );
};
