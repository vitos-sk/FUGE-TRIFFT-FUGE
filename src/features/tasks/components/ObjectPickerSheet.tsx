import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { ListItem, ItemLabel, CheckIcon, Empty } from './PickerList.styles';
import type { CRMObject } from '@shared/types';

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
  const handleSelect = (id: string) => {
    onChange(id);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Objekt">
      {objects.length === 0 ? (
        <Empty>Keine Objekte vorhanden.</Empty>
      ) : (
        objects.map((obj) => (
          <ListItem
            key={obj.id}
            type="button"
            $active={obj.id === value}
            onClick={() => handleSelect(obj.id)}
            aria-pressed={obj.id === value}
          >
            <ItemLabel $active={obj.id === value}>{obj.title}</ItemLabel>
            <CheckIcon>{obj.id === value && <FiCheck size={16} />}</CheckIcon>
          </ListItem>
        ))
      )}
    </BottomSheet>
  );
};
