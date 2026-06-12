import styled from 'styled-components';

export const Img = styled.img<{ $height: number; $radiusTop: string }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  object-fit: cover;
  display: block;
  border-radius: ${({ $radiusTop }) => $radiusTop} ${({ $radiusTop }) => $radiusTop} 0 0;
`;

export const MapLink = styled.a<{ $radiusTop: string }>`
  display: block;
  border-radius: ${({ $radiusTop }) => $radiusTop} ${({ $radiusTop }) => $radiusTop} 0 0;
  overflow: hidden;
  cursor: pointer;
`;
