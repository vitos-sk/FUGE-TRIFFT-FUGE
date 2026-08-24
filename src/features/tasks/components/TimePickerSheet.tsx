import React, { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import {
  PickerBody,
  PickerRow,
  ColStepper,
  ColCaption,
  StepBtn,
  ColDisplay,
  PickerColon,
  ConfirmBtn,
} from './TimePickerSheet.styles';

const STEP = 5;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (v: string) => void;
}

export const TimePickerSheet: React.FC<Props> = ({ isOpen, onClose, title, value, onChange }) => {
  const [h, setH] = useState(7);
  const [m, setM] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const [hStr = '7', mStr = '0'] = value.split(':');
    const rawM = Number(mStr);
    setH(Number(hStr));
    setM(Math.round(rawM / STEP) * STEP % 60);
  }, [isOpen, value]);

  const incH = () => setH((v) => (v + 1) % 24);
  const decH = () => setH((v) => (v + 23) % 24);
  const incM = () => setM((v) => (v + STEP) % 60);
  const decM = () => setM((v) => (v - STEP + 60) % 60);

  const confirm = () => {
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <PickerBody>
        <PickerRow>
          <ColStepper>
            <ColCaption>Stunde</ColCaption>
            <StepBtn type="button" onClick={incH} aria-label="Stunde erhöhen">
              <FiChevronUp size={22} />
            </StepBtn>
            <ColDisplay>{String(h).padStart(2, '0')}</ColDisplay>
            <StepBtn type="button" onClick={decH} aria-label="Stunde verringern">
              <FiChevronDown size={22} />
            </StepBtn>
          </ColStepper>

          <PickerColon>:</PickerColon>

          <ColStepper>
            <ColCaption>Minute</ColCaption>
            <StepBtn type="button" onClick={incM} aria-label="Minute erhöhen">
              <FiChevronUp size={22} />
            </StepBtn>
            <ColDisplay>{String(m).padStart(2, '0')}</ColDisplay>
            <StepBtn type="button" onClick={decM} aria-label="Minute verringern">
              <FiChevronDown size={22} />
            </StepBtn>
          </ColStepper>
        </PickerRow>
      </PickerBody>
      <ConfirmBtn type="button" onClick={confirm}>Übernehmen</ConfirmBtn>
    </BottomSheet>
  );
};
