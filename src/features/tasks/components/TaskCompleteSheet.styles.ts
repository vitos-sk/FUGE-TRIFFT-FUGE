import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CompleteBtn = styled.button`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.success};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: opacity 0.15s, transform 0.15s;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.successHover}; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const UploadBtn = styled.button`
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: opacity 0.15s, transform 0.15s;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.accentHover}; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const PendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const PendingThumb = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background: rgba(180, 30, 30, 0.85); }
`;

export const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
