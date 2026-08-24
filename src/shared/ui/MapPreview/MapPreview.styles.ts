import styled, { css } from 'styled-components';

export const Img = styled.img<{ $height: number; $radiusTop: string; $fill?: boolean }>`
  width: 100%;
  object-fit: cover;
  display: block;

  ${({ $fill, $height, $radiusTop }) =>
    $fill
      ? css`
          height: 100%;
          border-radius: inherit;
        `
      : css`
          height: ${$height}px;
          border-radius: ${$radiusTop} ${$radiusTop} 0 0;
        `}
`;

export const MapLink = styled.a<{ $radiusTop: string }>`
  display: block;
  border-radius: ${({ $radiusTop }) => $radiusTop} ${({ $radiusTop }) => $radiusTop} 0 0;
  overflow: hidden;
  cursor: pointer;
`;
