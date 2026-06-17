import React, { useId } from 'react';
import { Input, FormGroup, Label } from '../Input';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export const DateInput: React.FC<Props> = ({ label, value, onChange, ...rest }) => {
  const id = useId();
  return (
    <FormGroup className={rest.className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={rest.required}
        disabled={rest.disabled}
        min={rest.min}
        max={rest.max}
      />
    </FormGroup>
  );
};
