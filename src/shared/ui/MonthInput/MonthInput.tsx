import React from 'react';
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
  const input = (
    <Input
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
      {label && <Label>{label}</Label>}
      {input}
    </FormGroup>
  );
};
