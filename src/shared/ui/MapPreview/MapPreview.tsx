import React, { useState } from 'react';
import { Img, MapLink } from './MapPreview.styles';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

interface Props {
  address: string;
  city: string;
  height?: number;
  borderRadiusTop?: string;
  linkToMaps?: boolean;
  /** Fill the parent element instead of using a fixed height (for square thumbnails) */
  fill?: boolean;
}

function streetViewUrl(address: string, city: string, size: string): string {
  const loc = encodeURIComponent(`${address}, ${city}`);
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${loc}&fov=90&return_error_codes=true&key=${API_KEY}`;
}

function staticMapUrl(address: string, city: string, size: string): string {
  const loc = encodeURIComponent(`${address}, ${city}`);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${loc}&zoom=17&size=${size}&maptype=satellite&key=${API_KEY}`;
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
  fill = false,
}) => {
  const size = fill ? '320x320' : '600x220';
  const [src, setSrc] = useState(() => streetViewUrl(address, city, size));
  const [hidden, setHidden] = useState(false);

  if (!API_KEY || hidden) return null;

  const img = (
    <Img
      src={src}
      alt=""
      $height={height}
      $radiusTop={linkToMaps ? '0' : borderRadiusTop}
      $fill={fill}
      onError={() => {
        if (src.includes('streetview')) {
          setSrc(staticMapUrl(address, city, size));
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
