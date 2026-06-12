import React from 'react';
import { Select, FormGroup, Label } from '../Input';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  /** Provide options array OR children (<option> elements) */
  options?: SelectOption[];
  children?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SelectInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  children,
  required,
  disabled,
  className,
}) => (
  <FormGroup className={className}>
    {label && <Label>{label}</Label>}
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
    >
      {options
        ? options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        : children}
    </Select>
  </FormGroup>
);
