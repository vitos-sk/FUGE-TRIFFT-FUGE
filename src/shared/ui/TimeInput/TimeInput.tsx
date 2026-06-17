import React, { useId } from 'react';
import { Input, FormGroup, Label } from '../Input';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TimeInput: React.FC<Props> = ({ label, value, onChange, ...rest }) => {
  const id = useId();
  return (
    <FormGroup className={rest.className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={rest.required}
        disabled={rest.disabled}
      />
    </FormGroup>
  );
};
