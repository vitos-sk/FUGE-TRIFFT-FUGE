import styled, { keyframes } from 'styled-components';
import { glassSurface } from '../../../styles/glass';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

/* Desktop keeps the two pickers at their natural size, left-aligned */
export const Root = styled.div`
  @media (min-width: 769px) {
    max-width: 640px;
  }
`;

export const PickerRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(2, minmax(0, 210px));
    justify-content: start;
    gap: 8px;
  }
`;

/* Primary = camera (accent filled), secondary = gallery (outlined) */
export const PickerBtn = styled.label<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 50px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  text-align: center;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;

  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : theme.glass.fill};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.colors.accent : theme.glass.border};
  color: ${({ $primary, theme }) =>
    $primary ? '#fff' : theme.colors.textPrimary};

  @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
    backdrop-filter: ${({ $primary, theme }) =>
      $primary ? 'none' : theme.glass.blur};
    -webkit-backdrop-filter: ${({ $primary, theme }) =>
      $primary ? 'none' : theme.glass.blur};
  }

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.glass.fillHover};
    border-color: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.glass.borderHover};
  }

  &:active {
    opacity: 0.85;
  }

  &:focus-within {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  @media (min-width: 769px) {
    min-height: 42px;
    padding: 10px 14px;
    font-size: 13.5px;
    border-radius: 9px;
  }

  @media (max-width: 400px) {
    font-size: 13px;
    gap: 7px;
    padding: 12px 10px;
  }
`;

export const PreviewBox = styled.div`
  position: relative;
  max-width: 100%;
  ${glassSurface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 12px;
  text-align: center;
`;

export const Preview = styled.img`
  max-height: 200px;
  max-width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  object-fit: contain;
`;

export const ClearBtn = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.bgPrimary};
  cursor: pointer;
  transition: transform 0.15s;

  &:hover { transform: scale(1.1); }
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-top: 14px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  margin-top: 10px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 9999px;
    transition: width 0.4s ease;
  }
`;

export const UploadingLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
  text-align: center;
  animation: ${pulse} 1.5s infinite;
`;

export const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-top: 10px;
`;

export const HiddenInput = styled.input`
  display: none;
`;
