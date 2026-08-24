import React from 'react';

const NOW = Date.now();
import { FiMapPin, FiClock, FiMoreVertical, FiImage, FiArrowLeft } from 'react-icons/fi';
import { SiGooglemaps, SiWhatsapp } from 'react-icons/si';
import { format } from 'date-fns';
import { MapPreview } from '@shared/ui/MapPreview';
import { formatDayInline } from '@shared/utils/dateLabels';
import type { CRMObject } from '@shared/types';
import {
  HeaderCard,
  TopRow,
  BackBtn,
  Thumb,
  ThumbFallback,
  TitleBlock,
  Title,
  AddressRow,
  Address,
  MapsBtn,
  DeadlineChip,
  MenuBtn,
  MetaStrip,
  MetaCell,
  MetaText,
  WhatsAppRow,
  WhatsAppBtn,
} from './ObjectHeader.styles';

interface ObjectHeaderProps {
  object: CRMObject;
  photoCount: number;
  onOpenInfo: () => void;
}

export const ObjectHeader: React.FC<ObjectHeaderProps> = ({
  object,
  photoCount,
  onOpenInfo,
}) => {
  const deadline = object.deadline?.toDate?.() ?? null;
  const daysUntil = deadline
    ? Math.ceil((deadline.getTime() - NOW) / 86_400_000)
    : null;
  const isUrgent = daysUntil !== null && daysUntil <= 7;

  const lastActivity = object.lastActivityAt?.toDate?.() ?? null;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${object.address}, ${object.city}`,
  )}`;

  return (
    <>
      <HeaderCard>
        <TopRow>
          <BackBtn to="/objects" aria-label="Zurück zur Übersicht">
            <FiArrowLeft size={18} />
          </BackBtn>

          <Thumb>
            <ThumbFallback>
              <FiMapPin size={18} />
            </ThumbFallback>
            <MapPreview
              address={object.address}
              city={object.city}
              fill
              linkToMaps={false}
            />
          </Thumb>

          <TitleBlock>
            <Title>{object.title}</Title>
            <AddressRow>
              <Address>
                <FiMapPin size={12} />
                {object.address}, {object.city}
              </Address>
              <MapsBtn
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                title="In Google Maps öffnen"
                aria-label="In Google Maps öffnen"
              >
                <SiGooglemaps size={12} color="#EA4335" />
              </MapsBtn>
            </AddressRow>
            {deadline && (
              <DeadlineChip $urgent={isUrgent}>
                <FiClock size={10} />
                Termin: {format(deadline, 'dd.MM.yy')}
              </DeadlineChip>
            )}
          </TitleBlock>

          <MenuBtn onClick={onOpenInfo} aria-label="Objektdetails öffnen">
            <FiMoreVertical size={18} />
          </MenuBtn>
        </TopRow>

        <MetaStrip>
          <MetaCell>
            <FiImage size={14} />
            <MetaText>
              {photoCount} {photoCount === 1 ? 'Foto' : 'Fotos'}
            </MetaText>
          </MetaCell>
          <MetaCell>
            <FiClock size={14} />
            <MetaText>
              {lastActivity
                ? `Aktualisiert: ${formatDayInline(lastActivity)}`
                : 'Keine Aktivität'}
            </MetaText>
          </MetaCell>
        </MetaStrip>
      </HeaderCard>

      {object.whatsappLink && (
        <WhatsAppRow>
          <WhatsAppBtn
            href={object.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiWhatsapp size={14} color="#25D366" />
            WhatsApp
          </WhatsAppBtn>
        </WhatsAppRow>
      )}
    </>
  );
};
