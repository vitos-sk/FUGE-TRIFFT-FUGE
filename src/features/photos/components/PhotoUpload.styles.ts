import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

export const PickerRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const PickerBtn = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => `${theme.colors.accent}08`};
  }

  &:active {
    opacity: 0.85;
  }

  @media (max-width: 640px) {
    flex: 1;
    padding: 12px 16px;
    font-size: 13px;
    gap: 8px;
  }
`;

export const PreviewBox = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 12px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
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
