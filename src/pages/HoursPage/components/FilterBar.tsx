import React, { useState, useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { MonthInput } from "@shared/ui/MonthInput";
import type { AppUser } from "@shared/types";
import type { RangePreset } from "@features/hours/hooks/useHoursPage";
import {
  Card,
  FilterRow,
  FilterUserSelect,
  RangeGroup,
  RangeBtn,
  MonthBtnWrap,
  MonthDropdown,
  ExportMonthInput,
  ExportMonthWrap,
  ExportBtn,
  RowLabel,
  RowGroup,
} from "./FilterBar.styles";

interface FilterBarProps {
  isAdmin: boolean;
  range: RangePreset;
  setRange: (r: RangePreset) => void;
  pickedMonth: string;
  setPickedMonth: (v: string) => void;
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
  selectedUser,
  setSelectedUser,
  users,
  exportMonth,
  setExportMonth,
  exportToExcel,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const monthBtnRef = useRef<HTMLDivElement>(null);
  const exportWrapRef = useRef<HTMLDivElement>(null);

  const handleExportWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const input = exportWrapRef.current?.querySelector<HTMLInputElement>('input[type="month"]');
    if (!input) return;
    const rect = input.getBoundingClientRect();
    // если кликнули не по иконке календаря (последние 32px) — открываем пикер
    if (e.clientX < rect.right - 32) {
      try { (input as any).showPicker(); } catch { input.focus(); }
    }
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (monthBtnRef.current && !monthBtnRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
        setRange("month");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [pickerOpen]);

  const userOptions = [
    { value: "", label: "Alle Mitarbeiter" },
    ...users.map((u) => ({ value: u.uid, label: u.name })),
  ];

  return (
    <Card>
      {/* Row 1: Filter — elevated so MonthDropdown appears above Export row */}
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
              $active={range === "month" || range === "all"}
              type="button"
              onClick={() => {
                setRange("month");
                setPickerOpen(false);
              }}
            >
              Monat
            </RangeBtn>

            <RangeBtn
              $active={range === "week"}
              type="button"
              onClick={() => {
                setRange("week");
                setPickerOpen(false);
              }}
            >
              Woche
            </RangeBtn>

            <MonthBtnWrap ref={monthBtnRef}>
              <RangeBtn
                $active={range === "pick"}
                type="button"
                onClick={() => {
                  if (range !== "pick") {
                    setRange("pick");
                    setPickerOpen(true);
                  } else {
                    setPickerOpen((o) => !o);
                  }
                }}
              >
                Andere ▾
              </RangeBtn>

              {range === "pick" && pickerOpen && (
                <MonthDropdown>
                  <MonthInput
                    compact
                    style={{ padding: '6px 9px', fontSize: '12px' }}
                    value={pickedMonth}
                    onChange={(v) => {
                      setPickedMonth(v);
                      setPickerOpen(false);
                    }}
                  />
                </MonthDropdown>
              )}
            </MonthBtnWrap>
          </RangeGroup>
        </FilterRow>
      </RowGroup>

      {/* Row 2: Excel Export (admin only) */}
      {isAdmin && (
        <RowGroup>
          <RowLabel>Excel Export</RowLabel>
          <FilterRow>
            <ExportMonthWrap ref={exportWrapRef} onClick={handleExportWrapClick}>
              <ExportMonthInput value={exportMonth} onChange={setExportMonth} />
            </ExportMonthWrap>
            <ExportBtn onClick={exportToExcel}>
              <FiDownload size={13} />
              Export
            </ExportBtn>
          </FilterRow>
        </RowGroup>
      )}
    </Card>
  );
};
