import React, { useId } from 'react';
import { Input, FormGroup, Label, ErrorText } from '../Input';
import { FiAlertCircle } from 'react-icons/fi';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, id, error, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <FormGroup>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <Input
          id={inputId}
          ref={ref}
          $invalid={!!error}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {error && (
          <ErrorText id={errorId}>
            <FiAlertCircle size={12} />
            {error}
          </ErrorText>
        )}
      </FormGroup>
    );
  }
);

TextInput.displayName = 'TextInput';
