import React, { useRef, useState, useEffect } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { FormGroup, Label } from '../Input';
import {
  Wrap,
  Trigger,
  TriggerText,
  Arrow,
  Dropdown,
  OptionBtn,
  Check,
} from './CustomSelect.styles';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  labelNode?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  dropUp?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<Props> = ({
  label,
  labelNode,
  value,
  onChange,
  options,
  placeholder = '—',
  dropUp = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <FormGroup className={className}>
      {labelNode ? <Label>{labelNode}</Label> : label && <Label>{label}</Label>}
      <Wrap ref={wrapRef}>
        <Trigger type="button" $open={open} onClick={() => setOpen((o) => !o)}>
          <TriggerText>{displayLabel}</TriggerText>
          <Arrow $open={open} $dropUp={dropUp}>
            <FiChevronDown size={14} />
          </Arrow>
        </Trigger>

        {open && (
          <Dropdown $dropUp={dropUp}>
            {options.map((opt) => (
              <OptionBtn
                key={opt.value}
                type="button"
                $active={opt.value === value}
                onClick={() => handleSelect(opt.value)}
              >
                <Check>
                  {opt.value === value && <FiCheck size={12} />}
                </Check>
                {opt.label}
              </OptionBtn>
            ))}
          </Dropdown>
        )}
      </Wrap>
    </FormGroup>
  );
};
