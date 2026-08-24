import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { ListItem, ItemLabel, CheckIcon, Empty } from './PickerList.styles';
import type { AppUser } from '@shared/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  workers: AppUser[];
}

export const WorkerPickerSheet: React.FC<Props> = ({
  isOpen, onClose, value, onChange, workers,
}) => {
  const handleSelect = (uid: string) => {
    onChange(uid);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Mitarbeiter">
      {workers.length === 0 ? (
        <Empty>Keine Mitarbeiter vorhanden.</Empty>
      ) : (
        workers.map((worker) => (
          <ListItem
            key={worker.uid}
            type="button"
            $active={worker.uid === value}
            onClick={() => handleSelect(worker.uid)}
            aria-pressed={worker.uid === value}
          >
            <ItemLabel $active={worker.uid === value}>{worker.name}</ItemLabel>
            <CheckIcon>{worker.uid === value && <FiCheck size={16} />}</CheckIcon>
          </ListItem>
        ))
      )}
    </BottomSheet>
  );
};
