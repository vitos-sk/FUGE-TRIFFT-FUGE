import React, { useId } from 'react';
import { FormGroup, Label } from '@shared/ui/Input';
import { Btn, BtnText, BtnIcon } from './FieldBtn.styles';

interface Props {
  label: React.ReactNode;
  value: string;
  icon: React.ReactNode;
  onClick: () => void;
  $prominent?: boolean;
}

export const FieldBtn: React.FC<Props> = ({ label, value, icon, onClick, $prominent }) => {
  const id = useId();
  return (
    <FormGroup>
      <Label htmlFor={id}>{label}</Label>
      <Btn id={id} type="button" onClick={onClick} $prominent={$prominent}>
        <BtnText $prominent={$prominent}>{value}</BtnText>
        <BtnIcon>{icon}</BtnIcon>
      </Btn>
    </FormGroup>
  );
};
