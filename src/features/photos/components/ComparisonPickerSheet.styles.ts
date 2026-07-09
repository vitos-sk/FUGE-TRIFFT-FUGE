import styled from 'styled-components';

export const SlotSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const SlotLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SlotButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const SlotBtn = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const SlotPreview = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #080808;
`;

export const SlotPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ChangeBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 5px 10px;
  border-radius: 9999px;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(4px);
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 9999px;
    transition: width 0.2s ease;
  }
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;
`;

export const ThumbImg = styled.img`
  aspect-ratio: 1 / 1;
  width: 100%;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s, opacity 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const NoPhotosHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 8px 0;
`;

export const CancelPickBtn = styled.button`
  align-self: flex-start;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const Footer = styled.div`
  margin-top: 8px;
`;

export const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 14px;
`;
