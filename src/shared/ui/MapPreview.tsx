import React, { useState } from 'react';
import styled from 'styled-components';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface Props {
  address: string;
  city: string;
  height?: number;
  borderRadiusTop?: string;
  linkToMaps?: boolean;
}

const Img = styled.img<{ $height: number; $radiusTop: string }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  object-fit: cover;
  display: block;
  border-radius: ${({ $radiusTop }) => $radiusTop} ${({ $radiusTop }) => $radiusTop} 0 0;
`;

const MapLink = styled.a<{ $radiusTop: string }>`
  display: block;
  border-radius: ${({ $radiusTop }) => $radiusTop} ${({ $radiusTop }) => $radiusTop} 0 0;
  overflow: hidden;
  cursor: pointer;
`;

function streetViewUrl(address: string, city: string): string {
  const loc = encodeURIComponent(`${address}, ${city}`);
  return `https://maps.googleapis.com/maps/api/streetview?size=600x220&location=${loc}&fov=90&return_error_codes=true&key=${API_KEY}`;
}

function staticMapUrl(address: string, city: string): string {
  const loc = encodeURIComponent(`${address}, ${city}`);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${loc}&zoom=17&size=600x220&maptype=satellite&key=${API_KEY}`;
}

function mapsUrl(address: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`;
}

export const MapPreview: React.FC<Props> = ({
  address,
  city,
  height = 150,
  borderRadiusTop = '10px',
  linkToMaps = false,
}) => {
  const [src, setSrc] = useState(() => streetViewUrl(address, city));
  const [hidden, setHidden] = useState(false);

  if (!API_KEY || hidden) return null;

  const img = (
    <Img
      src={src}
      alt=""
      $height={height}
      $radiusTop={linkToMaps ? '0' : borderRadiusTop}
      onError={() => {
        if (src.includes('streetview')) {
          setSrc(staticMapUrl(address, city));
        } else {
          setHidden(true);
        }
      }}
    />
  );

  if (linkToMaps) {
    return (
      <MapLink
        href={mapsUrl(address, city)}
        target="_blank"
        rel="noopener noreferrer"
        $radiusTop={borderRadiusTop}
        onClick={(e) => e.stopPropagation()}
        title="In Google Maps öffnen"
      >
        {img}
      </MapLink>
    );
  }

  return img;
};
