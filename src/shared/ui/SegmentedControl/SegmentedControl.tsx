import { SegGroup, SegBtn } from './SegmentedControl.styles';

export { SegGroup, SegBtn } from './SegmentedControl.styles';

export interface SegOption<T extends string | number = string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  options: SegOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
}: Props<T>) {
  return (
    <SegGroup className={className}>
      {options.map((opt) => (
        <SegBtn
          key={String(opt.value)}
          type="button"
          $active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </SegBtn>
      ))}
    </SegGroup>
  );
}
