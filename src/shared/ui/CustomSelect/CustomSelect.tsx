import React, { useRef, useState, useEffect, useId } from 'react';
import { FiCheck, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { FormGroup, Label, ErrorText } from '../Input';
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
  disabled?: boolean;
  error?: string;
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
  disabled = false,
  error,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const errorId = `${id}-error`;

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

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-index="${highlighted}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, highlighted]);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const displayLabel = selected ? selected.label : placeholder;

  const openList = () => {
    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const closeList = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (val: string) => {
    onChange(val);
    closeList();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlighted >= 0 && options[highlighted]) handleSelect(options[highlighted].value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeList();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <FormGroup className={className}>
      {labelNode ? <Label htmlFor={id}>{labelNode}</Label> : label && <Label htmlFor={id}>{label}</Label>}
      <Wrap ref={wrapRef}>
        <Trigger
          id={id}
          ref={triggerRef}
          type="button"
          $open={open}
          $invalid={!!error}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          aria-activedescendant={open && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined}
          onClick={() => (open ? closeList() : openList())}
          onKeyDown={handleKeyDown}
        >
          <TriggerText>{displayLabel}</TriggerText>
          <Arrow $open={open} $dropUp={dropUp}>
            <FiChevronDown size={14} />
          </Arrow>
        </Trigger>

        {open && (
          <Dropdown $dropUp={dropUp} id={`${id}-listbox`} role="listbox" ref={listRef}>
            {options.map((opt, i) => (
              <OptionBtn
                key={opt.value}
                id={`${id}-option-${i}`}
                data-index={i}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                $active={opt.value === value}
                $highlighted={i === highlighted}
                onMouseEnter={() => setHighlighted(i)}
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
      {error && (
        <ErrorText id={errorId}>
          <FiAlertCircle size={12} />
          {error}
        </ErrorText>
      )}
    </FormGroup>
  );
};
