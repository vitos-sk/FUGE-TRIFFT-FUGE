import React, { useId } from 'react';
import { Select, FormGroup, Label, ErrorText } from '../Input';
import { FiAlertCircle } from 'react-icons/fi';

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
  error?: string;
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
  error,
  className,
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <FormGroup className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        $invalid={!!error}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </Select>
      {error && (
        <ErrorText id={errorId}>
          <FiAlertCircle size={12} />
          {error}
        </ErrorText>
      )}
    </FormGroup>
  );
};
