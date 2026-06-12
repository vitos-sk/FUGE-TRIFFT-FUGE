import React from 'react';
import { Input, FormGroup, Label } from '../Input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, ...rest }, ref) => (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Input ref={ref} {...rest} />
    </FormGroup>
  )
);

TextInput.displayName = 'TextInput';
