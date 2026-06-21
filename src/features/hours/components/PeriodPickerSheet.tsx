import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiCheck } from 'react-icons/fi';
import { BottomSheet } from '@shared/ui/BottomSheet';
import { FieldBtn } from './FieldBtn';
import { DatePickerSheet } from './DatePickerSheet';
import {
  PresetList, PresetItem, SectionDivider, SectionLabel,
  YearNav, NavBtn, YearLabel, MonthGrid, MonthCell,
  CustomRow, ConfirmBtn,
} from './PeriodPickerSheet.styles';

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

const parseYM = (v: string): { year: number; month: number } => {
  const [y, m] = v.split('-').map(Number);
  const now = new Date();
  return { year: y || now.getFullYear(), month: m || now.getMonth() + 1 };
};

const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDateDisplay = (iso: string): string => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Currently picked month in "YYYY-MM" format */
  pickedMonth: string;
  /** Called when user picks a specific month; caller should set range='pick' */
  onPickMonth: (v: string) => void;
  /** Currently active custom "from" date in "YYYY-MM-DD" format */
  customFrom: string;
  /** Currently active custom "to" date in "YYYY-MM-DD" format */
  customTo: string;
  /** Called when user confirms a custom date range */
  onCustomRange: (from: string, to: string) => void;
  /** Currently active range preset */
  activeRange: string;
}

export const PeriodPickerSheet: React.FC<Props> = ({
  isOpen, onClose, pickedMonth, onPickMonth,
  customFrom, customTo, onCustomRange, activeRange,
}) => {
  const [viewYear, setViewYear] = useState(() => parseYM(pickedMonth).year);
  const [localFrom, setLocalFrom] = useState(customFrom || toIso(new Date()));
  const [localTo, setLocalTo] = useState(customTo || toIso(new Date()));
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setViewYear(parseYM(pickedMonth).year);
      setLocalFrom(customFrom || toIso(new Date()));
      setLocalTo(customTo || toIso(new Date()));
    }
  }, [isOpen, pickedMonth, customFrom, customTo]);

  const { year: selYear, month: selMonth } = parseYM(pickedMonth);
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  const handlePickMonth = (idx: number) => {
    onPickMonth(`${viewYear}-${String(idx + 1).padStart(2, '0')}`);
    onClose();
  };

  const handleLastMonth = () => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1);
    onPickMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    onClose();
  };

  const handleConfirmCustom = () => {
    if (!localFrom || !localTo) return;
    onCustomRange(localFrom, localTo);
    onClose();
  };

  const isLastMonth = (() => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1);
    const lm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return activeRange === 'pick' && pickedMonth === lm;
  })();

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title="Zeitraum">
        {/* ── Schnellauswahl ── */}
        <SectionLabel>Schnellauswahl</SectionLabel>
        <PresetList>
          <PresetItem
            type="button"
            $active={isLastMonth}
            onClick={handleLastMonth}
          >
            {isLastMonth && <FiCheck size={14} />}
            Letzter Monat
          </PresetItem>
        </PresetList>

        <SectionDivider />

        {/* ── Bestimmter Monat ── */}
        <SectionLabel>Bestimmter Monat</SectionLabel>
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
              $selected={activeRange === 'pick' && viewYear === selYear && idx + 1 === selMonth && !isLastMonth}
              $current={viewYear === nowYear && idx + 1 === nowMonth}
              onClick={() => handlePickMonth(idx)}
              aria-pressed={activeRange === 'pick' && viewYear === selYear && idx + 1 === selMonth && !isLastMonth}
            >
              {name}
            </MonthCell>
          ))}
        </MonthGrid>

        <SectionDivider />

        {/* ── Eigener Zeitraum ── */}
        <SectionLabel>Eigener Zeitraum</SectionLabel>
        <CustomRow>
          <FieldBtn
            label="Von"
            value={formatDateDisplay(localFrom)}
            icon={<FiCalendar size={14} />}
            onClick={() => setFromOpen(true)}
          />
          <FieldBtn
            label="Bis"
            value={formatDateDisplay(localTo)}
            icon={<FiCalendar size={14} />}
            onClick={() => setToOpen(true)}
          />
        </CustomRow>
        <ConfirmBtn
          type="button"
          onClick={handleConfirmCustom}
          disabled={!localFrom || !localTo || localFrom > localTo}
        >
          Zeitraum übernehmen
        </ConfirmBtn>
      </BottomSheet>

      <DatePickerSheet
        isOpen={fromOpen}
        onClose={() => setFromOpen(false)}
        value={localFrom}
        onChange={setLocalFrom}
      />
      <DatePickerSheet
        isOpen={toOpen}
        onClose={() => setToOpen(false)}
        value={localTo}
        onChange={setLocalTo}
      />
    </>
  );
};
