import React, { useId } from 'react';
import { Input, FormGroup, Label } from '../Input';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  /** compact=true renders just the input without FormGroup/Label wrapper */
  compact?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const MonthInput: React.FC<Props> = ({ label, value, onChange, compact, style, className }) => {
  const id = useId();
  const input = (
    <Input
      id={compact ? undefined : id}
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={compact ? className : undefined}
      style={style}
    />
  );

  if (compact) return input;

  return (
    <FormGroup className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {input}
    </FormGroup>
  );
};
