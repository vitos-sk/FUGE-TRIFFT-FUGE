import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styled from 'styled-components';
import { BottomSheet } from '@shared/ui/BottomSheet';
import type { FilterOption } from '../types';

const Item = styled.button<{ $active: boolean }>`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ $active }) => ($active ? 'rgba(204, 34, 34, 0.14)' : 'transparent')};
  font-family: inherit;
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ $active }) => ($active ? 'rgba(204, 34, 34, 0.2)' : 'rgba(255, 255, 255, 0.07)')};
  }
  &:active {
    opacity: 0.75;
  }
`;

const Avatar = styled.span`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 700;
`;

const Texts = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span<{ $active: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: ${({ $active }) => ($active ? '#ff6060' : 'rgba(255, 255, 255, 0.88)')};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
`;

const Sub = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
`;

const Check = styled.span`
  flex-shrink: 0;
  width: 16px;
  display: flex;
  color: #ff6060;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

/** Single-choice list in a bottom sheet (employee / object filters). */
export const OptionSheet: React.FC<Props> = ({ isOpen, onClose, title, value, options, onChange }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <Item
          key={opt.value || 'all'}
          type="button"
          $active={active}
          aria-pressed={active}
          onClick={() => {
            onChange(opt.value);
            onClose();
          }}
        >
          {opt.initials && <Avatar>{opt.initials}</Avatar>}
          <Texts>
            <Label $active={active}>{opt.label}</Label>
            {opt.sub && <Sub>{opt.sub}</Sub>}
          </Texts>
          <Check>{active && <FiCheck size={16} />}</Check>
        </Item>
      );
    })}
  </BottomSheet>
);
