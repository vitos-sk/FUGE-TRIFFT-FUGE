import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styled from 'styled-components';
import { controlHeight } from './hoursUi.styles';

const Btn = styled.button<{ $active: boolean }>`
  ${controlHeight}
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
  color: ${({ $active }) => ($active ? '#ff8a8a' : 'rgba(255,255,255,0.8)')};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : 'rgba(255,255,255,0.04)')};
  border: 1px solid
    ${({ $active, theme }) => ($active ? `${theme.colors.accent}88` : 'rgba(255,255,255,0.12)')};

  &:hover {
    border-color: ${({ $active, theme }) => ($active ? theme.colors.accent : 'rgba(255,255,255,0.2)')};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Lead = styled.span`
  display: flex;
  flex-shrink: 0;
  opacity: 0.65;
`;

const Chevron = styled.span`
  display: flex;
  flex-shrink: 0;
  opacity: 0.5;
`;

interface Props {
  icon: React.ReactNode;
  label: string;
  /** A filter other than "all" is applied — shown with the accent border. */
  active: boolean;
  onClick: () => void;
}

/** Compact dropdown trigger. The list itself opens in an OptionSheet. */
export const FilterButton: React.FC<Props> = ({ icon, label, active, onClick }) => (
  <Btn type="button" $active={active} onClick={onClick} aria-haspopup="dialog">
    <Lead>{icon}</Lead>
    <Label>{label}</Label>
    <Chevron>
      <FiChevronDown size={15} />
    </Chevron>
  </Btn>
);
