import React, { useState } from "react";
import { FiDownload, FiCalendar } from "react-icons/fi";
import type { AppUser } from "@shared/types";
import type { RangePreset } from "@features/hours/hooks/useHoursPage";
import { FieldBtn } from "@features/hours/components/FieldBtn";
import { MonthPickerSheet } from "@features/hours/components/MonthPickerSheet";
import { PeriodPickerSheet } from "@features/hours/components/PeriodPickerSheet";
import {
  Card,
  FilterRow,
  FilterUserSelect,
  RangeGroup,
  RangeBtn,
  ExportBtn,
  RowLabel,
  RowGroup,
  ExportFieldWrap,
  ExportFilterRow,
} from "./FilterBar.styles";

const formatMonthDisplay = (yyyyMm: string): string => {
  const [y, m] = yyyyMm.split("-").map(Number);
  if (!y || !m) return yyyyMm;
  return new Date(y, m - 1).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
};

interface FilterBarProps {
  isAdmin: boolean;
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

  return (
    <Card>
      {/* Row 1: Filter */}
      <RowGroup $elevated>
        <RowLabel>Filter</RowLabel>
        <FilterRow>
          {isAdmin && (
            <FilterUserSelect
              value={selectedUser}
              onChange={setSelectedUser}
              options={userOptions}
            />
          )}

          <RangeGroup>
            <RangeBtn
              $active={range === "month"}
              type="button"
              onClick={() => setRange("month")}
            >
              Monat
            </RangeBtn>

            <RangeBtn
              $active={range === "week"}
              type="button"
              onClick={() => setRange("week")}
            >
              Woche
            </RangeBtn>

            <RangeBtn
              $active={range === "pick" || range === "custom"}
              type="button"
              onClick={() => {
                if (range !== "pick" && range !== "custom") setRange("pick");
                setPeriodPickerOpen(true);
              }}
            >
              Andere ▾
            </RangeBtn>
          </RangeGroup>
        </FilterRow>
      </RowGroup>

      {/* Row 2: Excel Export (admin only) */}
      {isAdmin && (
        <RowGroup>
          <RowLabel>Excel Export</RowLabel>
          <ExportFilterRow>
            <ExportFieldWrap>
              <FieldBtn
                label="Monat"
                value={formatMonthDisplay(exportMonth)}
                icon={<FiCalendar size={14} />}
                onClick={() => setExportPickerOpen(true)}
              />
            </ExportFieldWrap>
            <ExportBtn onClick={exportToExcel}>
              <FiDownload size={13} />
              Export
            </ExportBtn>
          </ExportFilterRow>
        </RowGroup>
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
