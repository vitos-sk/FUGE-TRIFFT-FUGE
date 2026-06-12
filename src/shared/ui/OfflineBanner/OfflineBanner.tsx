import React from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { Banner, Dot } from './OfflineBanner.styles';

interface Props {
  message?: string;
}

export const OfflineBanner: React.FC<Props> = ({
  message = 'Kein Internet – Daten können nicht geladen werden',
}) => (
  <Banner>
    <FiWifiOff size={15} style={{ flexShrink: 0 }} />
    {message}
    <Dot style={{ marginLeft: 'auto' }} />
  </Banner>
);
