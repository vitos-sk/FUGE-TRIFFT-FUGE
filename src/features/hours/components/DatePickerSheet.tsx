import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { CalHeader, NavBtn, MonthLabel, WeekRow, DayGrid, DayCell } from './DatePickerSheet.styles';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const parseIso = (iso: string): Date => {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(y, mo - 1, d);
};

const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const todayIso = (): string => toIso(new Date());

const getCalendarStart = (year: number, month: number): Date => {
  const first = new Date(year, month, 1);
  const dow = (first.getDay() + 6) % 7; // Monday = 0
  const start = new Date(year, month, 1 - dow);
  return start;
};

const formatMonthLabel = (d: Date): string =>
  d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
}

export const DatePickerSheet: React.FC<Props> = ({ isOpen, onClose, value, onChange }) => {
  const [view, setView] = useState<Date>(() => parseIso(value || todayIso()));

  useEffect(() => {
    if (isOpen) setView(parseIso(value || todayIso()));
  }, [isOpen, value]);

  const year = view.getFullYear();
  const month = view.getMonth();

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));

  const calStart = getCalendarStart(year, month);
  const cells: Date[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(calStart);
    d.setDate(calStart.getDate() + i);
    return d;
  });

  const today = todayIso();

  const handleSelect = (d: Date) => {
    onChange(toIso(d));
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Datum">
      <CalHeader>
        <NavBtn type="button" onClick={prevMonth} aria-label="Vorheriger Monat">
          <FiChevronLeft size={20} />
        </NavBtn>
        <MonthLabel>{formatMonthLabel(view)}</MonthLabel>
        <NavBtn type="button" onClick={nextMonth} aria-label="Nächster Monat">
          <FiChevronRight size={20} />
        </NavBtn>
      </CalHeader>

      <WeekRow>
        {WEEKDAYS.map((wd) => <span key={wd}>{wd}</span>)}
      </WeekRow>

      <DayGrid>
        {cells.map((d, i) => {
          const iso = toIso(d);
          return (
            <DayCell
              key={i}
              type="button"
              $selected={iso === value}
              $today={iso === today}
              $otherMonth={d.getMonth() !== month}
              onClick={() => handleSelect(d)}
              aria-pressed={iso === value}
              aria-label={iso}
            >
              {d.getDate()}
            </DayCell>
          );
        })}
      </DayGrid>
    </BottomSheet>
  );
};
