import styled, { css, keyframes } from 'styled-components';

const statusColors: Record<string, string> = {
  new: '#3498db',
  in_progress: '#cc2222',
  paused: '#6c757d',
  done: '#27ae60',
};

const fadeSlideOut = keyframes`
  0%   { opacity: 1; transform: scale(1);    max-height: 400px; margin-bottom: 0; }
  60%  { opacity: 0; transform: scale(0.96); max-height: 400px; }
  100% { opacity: 0; transform: scale(0.96); max-height: 0;     margin-bottom: -14px; padding: 0; }
`;

export const Card = styled.div<{ $archiving: boolean; $status: string }>`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-top: 3px solid ${({ $status }) => statusColors[$status] || '#252525'};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    background: #1b1b1b;
    border-color: rgba(255, 255, 255, 0.12);
    border-top-color: ${({ $status }) => statusColors[$status] || '#252525'};
    box-shadow:
      0 0 0 1px ${({ $status }) => statusColors[$status] || '#252525'}28,
      0 10px 30px rgba(0, 0, 0, 0.5);
  }

  &:active {
    opacity: 0.88;
    transition: opacity 0.08s;
  }

  ${({ $archiving }) =>
    $archiving &&
    css`
      animation: ${fadeSlideOut} 0.5s ease forwards;
      pointer-events: none;
      cursor: default;
      &:hover {
        background: #161616;
        box-shadow: none;
        border-color: rgba(255, 255, 255, 0.07);
      }
    `}
`;

export const CardHeader = styled.div`
  padding: 16px 16px 0;
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
  width: 36px;
  height: 36px;
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
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: rgba(16, 16, 16, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
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
      $success
        ? `${theme.colors.success}14`
        : $danger
        ? theme.colors.accentDim
        : theme.colors.bgElevated};
    color: ${({ $success, $danger, theme }) =>
      $success ? theme.colors.success : $danger ? theme.colors.accent : theme.colors.textPrimary};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
`;

export const Location = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1.4;
  flex: 1;
  min-width: 0;

  svg { flex-shrink: 0; }
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
`;

export const CardBody = styled.div`
  padding: 12px 16px;
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
  ${({ $ok, theme }) => $ok && css`color: ${theme.colors.success};`}
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  padding: 3px 10px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

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
  background: ${({ $done, theme }) => ($done ? theme.colors.success : theme.colors.accent)};
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

export const LastNote = styled.div`
  margin-top: 2px;
  padding: 8px 11px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
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
