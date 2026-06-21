import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { YearNav, NavBtn, YearLabel, MonthGrid, MonthCell } from './MonthPickerSheet.styles';

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

const parseYM = (v: string): { year: number; month: number } => {
  const [y, m] = v.split('-').map(Number);
  const now = new Date();
  return { year: y || now.getFullYear(), month: m || now.getMonth() + 1 };
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  value: string;   // "YYYY-MM"
  onChange: (v: string) => void;
}

export const MonthPickerSheet: React.FC<Props> = ({
  isOpen, onClose, title = 'Monat', value, onChange,
}) => {
  const [viewYear, setViewYear] = useState(() => parseYM(value).year);

  useEffect(() => {
    if (isOpen) setViewYear(parseYM(value).year);
  }, [isOpen, value]);

  const { year: selYear, month: selMonth } = parseYM(value);
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  const handleSelect = (idx: number) => {
    onChange(`${viewYear}-${String(idx + 1).padStart(2, '0')}`);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <YearNav>
        <NavBtn type="button" onClick={() => setViewYear((y) => y - 1)} aria-label="Vorheriges Jahr">
          <FiChevronLeft size={20} />
        </NavBtn>
        <YearLabel>{viewYear}</YearLabel>
        <NavBtn type="button" onClick={() => setViewYear((y) => y + 1)} aria-label="Nächstes Jahr">
          <FiChevronRight size={20} />
        </NavBtn>
      </YearNav>
      <MonthGrid>
        {MONTHS_DE.map((name, idx) => (
          <MonthCell
            key={idx}
            type="button"
            $selected={viewYear === selYear && idx + 1 === selMonth}
            $current={viewYear === nowYear && idx + 1 === nowMonth}
            onClick={() => handleSelect(idx)}
            aria-pressed={viewYear === selYear && idx + 1 === selMonth}
          >
            {name}
          </MonthCell>
        ))}
      </MonthGrid>
    </BottomSheet>
  );
};
