import React, { useState } from "react";
import { FiDownload, FiCalendar } from "react-icons/fi";
import type { AppUser } from "@shared/types";
import type { RangePreset } from "@features/hours/hooks/useHoursPage";
import { MonthPickerSheet } from "@features/hours/components/MonthPickerSheet";
import { PeriodPickerSheet } from "@features/hours/components/PeriodPickerSheet";
import {
  Card,
  SectionHead,
  Field,
  FieldLabel,
  FilterUserSelect,
  RangeGroup,
  RangeBtn,
  RangeBtnLabel,
  RangeBtnLabelShort,
  PeriodRow,
  PeriodText,
  PeriodAction,
  ExportRow,
  ExportMonthBtn,
  ExportBtn,
} from "./FilterBar.styles";

const formatMonthDisplay = (yyyyMm: string): string => {
  const [y, m] = yyyyMm.split("-").map(Number);
  if (!y || !m) return yyyyMm;
  return new Date(y, m - 1).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
};

interface FilterBarProps {
  isAdmin: boolean;
  /** Ausformulierter aktiver Zeitraum, z. B. "01.–31. August 2026" */
  periodRange: string;
  range: RangePreset;
  setRange: (r: RangePreset) => void;
  pickedMonth: string;
  setPickedMonth: (v: string) => void;
  customFrom: string;
  customTo: string;
  setCustomRange: (from: string, to: string) => void;
  selectedUser: string;
  setSelectedUser: (u: string) => void;
  users: AppUser[];
  exportMonth: string;
  setExportMonth: (v: string) => void;
  exportToExcel: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  isAdmin,
  periodRange,
  range,
  setRange,
  pickedMonth,
  setPickedMonth,
  customFrom,
  customTo,
  setCustomRange,
  selectedUser,
  setSelectedUser,
  users,
  exportMonth,
  setExportMonth,
  exportToExcel,
}) => {
  const [periodPickerOpen, setPeriodPickerOpen] = useState(false);
  const [exportPickerOpen, setExportPickerOpen] = useState(false);

  const userOptions = [
    { value: "", label: "Alle Mitarbeiter" },
    ...users.map((u) => ({ value: u.uid, label: u.name })),
  ];

  const handlePickMonth = (v: string) => {
    setPickedMonth(v);
    setRange("pick");
  };

  const openPeriodPicker = () => {
    if (range !== "pick" && range !== "custom") setRange("pick");
    setPeriodPickerOpen(true);
  };

  return (
    <Card>
      <SectionHead>Ansicht filtern</SectionHead>

      {isAdmin && (
        <Field>
          <FieldLabel>Mitarbeiter</FieldLabel>
          <FilterUserSelect
            value={selectedUser}
            onChange={setSelectedUser}
            options={userOptions}
          />
        </Field>
      )}

      <Field>
        <FieldLabel>Zeitraum</FieldLabel>

        <RangeGroup>
          <RangeBtn $active={range === "month"} type="button" onClick={() => setRange("month")}>
            Monat
          </RangeBtn>

          <RangeBtn $active={range === "week"} type="button" onClick={() => setRange("week")}>
            Woche
          </RangeBtn>

          <RangeBtn
            $active={range === "pick" || range === "custom"}
            type="button"
            onClick={openPeriodPicker}
          >
            <RangeBtnLabel>Anderer Monat</RangeBtnLabel>
            <RangeBtnLabelShort>Andere</RangeBtnLabelShort>
            <FiCalendar size={13} />
          </RangeBtn>
        </RangeGroup>

        <PeriodRow type="button" onClick={openPeriodPicker}>
          <FiCalendar size={15} />
          <PeriodText>{periodRange}</PeriodText>
          <PeriodAction>Ändern</PeriodAction>
        </PeriodRow>
      </Field>

      {isAdmin && (
        <Field>
          <FieldLabel>Excel Export</FieldLabel>
          <ExportRow>
            <ExportMonthBtn type="button" onClick={() => setExportPickerOpen(true)}>
              <FiCalendar size={15} />
              <PeriodText>{formatMonthDisplay(exportMonth)}</PeriodText>
            </ExportMonthBtn>
            <ExportBtn type="button" onClick={exportToExcel}>
              <FiDownload size={14} />
              Export
            </ExportBtn>
          </ExportRow>
        </Field>
      )}

      <PeriodPickerSheet
        isOpen={periodPickerOpen}
        onClose={() => setPeriodPickerOpen(false)}
        pickedMonth={pickedMonth}
        onPickMonth={handlePickMonth}
        customFrom={customFrom}
        customTo={customTo}
        onCustomRange={(from, to) => {
          setCustomRange(from, to);
          setPeriodPickerOpen(false);
        }}
        activeRange={range}
      />

      <MonthPickerSheet
        isOpen={exportPickerOpen}
        onClose={() => setExportPickerOpen(false)}
        title="Exportmonat"
        value={exportMonth}
        onChange={setExportMonth}
      />
    </Card>
  );
};
