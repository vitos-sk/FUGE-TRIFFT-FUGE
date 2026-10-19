import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { DatePickerSheet } from './DatePickerSheet';
import { currentMonth, formatMonthTitle, monthOfDate, shiftMonth } from '../utils/monthUtils';
import { todayIso } from '../utils/timeUtils';
import { Wrap, Arrow, Title } from './MonthNav.styles';

interface Props {
  /** "YYYY-MM" */
  month: string;
  onChange: (month: string) => void;
}

/** ‹ [Oktober 2026] › — the title opens a calendar, picking any day switches to its month. */
export const MonthNav: React.FC<Props> = ({ month, onChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const calendarValue = month === currentMonth() ? todayIso() : `${month}-01`;

  return (
    <>
      <Wrap>
        <Arrow type="button" onClick={() => onChange(shiftMonth(month, -1))} aria-label="Vorheriger Monat">
          <FiChevronLeft size={18} />
        </Arrow>
        <Title type="button" onClick={() => setCalendarOpen(true)} aria-label="Kalender öffnen">
          <FiCalendar size={15} />
          {formatMonthTitle(month)}
        </Title>
        <Arrow type="button" onClick={() => onChange(shiftMonth(month, 1))} aria-label="Nächster Monat">
          <FiChevronRight size={18} />
        </Arrow>
      </Wrap>

      <DatePickerSheet
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        value={calendarValue}
        onChange={(iso) => onChange(monthOfDate(iso))}
      />
    </>
  );
};
