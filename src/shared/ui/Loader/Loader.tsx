import React from 'react';
import { LoaderIcon, LoaderCenter, LoaderFullPage } from './Loader.styles';

export const Loader: React.FC = () => (
  <LoaderCenter>
    <LoaderIcon />
  </LoaderCenter>
);

export const FullPageLoader: React.FC = () => (
  <LoaderFullPage>
    <LoaderIcon />
  </LoaderFullPage>
);
