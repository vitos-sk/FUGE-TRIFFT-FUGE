import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { ListItem, ItemLabel, CheckIcon } from './ObjectPickerSheet.styles';
import type { CRMObject } from '@shared/types';

const KEIN_OBJEKT = { id: '', title: '⚠ kein Objekt' };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  objects: CRMObject[];
}

export const ObjectPickerSheet: React.FC<Props> = ({
  isOpen, onClose, value, onChange, objects,
}) => {
  const options = [KEIN_OBJEKT, ...objects.map((o) => ({ id: o.id, title: o.title }))];

  const handleSelect = (id: string) => {
    onChange(id);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Objekt">
      {options.map((opt) => (
        <ListItem
          key={opt.id}
          type="button"
          $active={opt.id === value}
          onClick={() => handleSelect(opt.id)}
          aria-pressed={opt.id === value}
        >
          <ItemLabel $active={opt.id === value}>{opt.title}</ItemLabel>
          <CheckIcon>{opt.id === value && <FiCheck size={16} />}</CheckIcon>
        </ListItem>
      ))}
    </BottomSheet>
  );
};
