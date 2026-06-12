import styled, { css, keyframes } from 'styled-components';

const fadeSlideOut = keyframes`
  0%   { opacity: 1; transform: scale(1);    max-height: 400px; margin-bottom: 0; }
  60%  { opacity: 0; transform: scale(0.96); max-height: 400px; }
  100% { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: -14px; padding: 0; }
`;

export const Card = styled.div<{ $archiving: boolean }>`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 20px rgba(0, 0, 0, 0.45);
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.spring};
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-3px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 16px 48px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.07);
  }

  &:active { transform: translateY(-1px); }

  ${({ $archiving }) => $archiving && css`
    animation: ${fadeSlideOut} 0.5s ease forwards;
    pointer-events: none;
    cursor: default;
    &:hover { transform: none; box-shadow: none; border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); }
  `}
`;

export const CardHeader = styled.div`
  padding: 18px 18px 0;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  flex: 1;
`;

export const MenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const MenuBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: 1px;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: rgba(255,255,255,0.08);
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: rgba(16, 16, 16, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06);
  min-width: 200px;
  z-index: 500;
  overflow: hidden;
`;

export const DropdownItem = styled.button<{ $danger?: boolean; $success?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $success, $danger, theme }) =>
    $success ? theme.colors.success : $danger ? theme.colors.accent : theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${({ $success, $danger, theme }) =>
      $success ? `${theme.colors.success}14` : $danger ? theme.colors.accentDim : theme.colors.bgElevated};
    color: ${({ $success, $danger, theme }) =>
      $success ? theme.colors.success : $danger ? theme.colors.accent : theme.colors.textPrimary};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const Location = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 14px;
  line-height: 1.4;

  svg { flex-shrink: 0; }
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  margin: 0;
`;

export const CardBody = styled.div`
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const MetaItem = styled.div<{ $warn?: boolean; $ok?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  ${({ $warn, theme }) => $warn && css`color: ${theme.colors.accent};`}
  ${({ $ok }) => $ok && css`color: #22a35a;`}
  ${({ $warn, $ok, theme }) => !$warn && !$ok && css`color: ${theme.colors.textMuted};`}
`;

export const NoteCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  padding: 3px 10px;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${Card}:hover & { border-color: ${({ theme }) => theme.colors.borderHover}; }
`;

export const ChecklistBar = styled.div`
  margin-top: 2px;
`;

export const ChecklistLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

export const ProgressTrack = styled.div`
  height: 3px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number; $done: boolean }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $done }) => $done ? '#22a35a' : '#cc2222'};
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

export const LastNote = styled.div`
  margin-top: 2px;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 ${({ theme }) => theme.borderRadiusSm} ${({ theme }) => theme.borderRadiusSm} 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const LastNoteAuthor = styled.span`
  font-style: normal;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: 4px;
`;

export const DeadlineGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const ChecklistLabelLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;
