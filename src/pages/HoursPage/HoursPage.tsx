import React, { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiList } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { LuCalculator } from "react-icons/lu";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { AddHoursForm } from "@features/hours/components/AddHoursForm";
import { HoursTable } from "@features/hours/components/HoursTable";

import { useHoursPage } from "@features/hours/hooks/useHoursPage";
import { formatPeriodTitle, formatPeriodRange } from "@features/hours/utils/periodLabel";
import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";
import { OfflineBanner } from "@shared/ui/OfflineBanner";
import { SegmentedControl, type SegOption } from "@shared/ui/SegmentedControl";
import type { WorkHourEntry } from "@shared/types";
import { WageModal } from "./components/WageModal";
import { FilterBar } from "./components/FilterBar";
import { TableSkeleton } from "./components/TableSkeleton";
import {
  TabBarWrapper,
  ViewPanel,
  StatsCard,
  StatsPeriod,
  StatsLabel,
  StatsValue,
  StatsDivider,
  StatsActions,
  StatsBtn,
  SectionTitle,
  RefreshIndicator,
  RefreshDot,
} from "./HoursPage.styles";

function buildReport(
  entries: WorkHourEntry[],
  periodLabel: string,
  workerLabel: string,
): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const header = `Arbeitsbericht ${periodLabel}${workerLabel ? " – " + workerLabel : ""}`;
  const lines = sorted.map((e) => {
    const dateStr = format(new Date(e.date + "T12:00:00"), "dd.MM. EEE", { locale: de });
    const time = `${e.startTime}–${e.endTime}`;
    const pause = e.breakMinutes > 0 ? `-${e.breakMinutes}min` : "";
    const obj = e.objectTitle || "–";
    return [dateStr, time, pause, obj].filter(Boolean).join(" · ");
  });
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const th = Math.floor(totalMins / 60);
  const tm = totalMins % 60;
  return `${header}\n\n${lines.join("\n")}\n\nGesamt: ${th}:${String(tm).padStart(2, "0")} h`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const HoursPage: React.FC = () => {
  const {
    isAdmin,
    tab,
    setTab,
    entries,
    users,
    selectedUser,
    setSelectedUser,
    range,
    setRange,
    pickedMonth,
    setPickedMonth,
    customFrom,
    customTo,
    setCustomRange,
    loading,
    refreshing,
    exportMonth,
    setExportMonth,
    load,
    exportToExcel,
  } = useHoursPage();
  const isOnline = useOnlineStatus();

  const [copied, setCopied] = useState(false);
  const [showWageModal, setShowWageModal] = useState(false);

  useEffect(() => {
    let startX = 0,
      startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 60) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.75) return;
      if ((e.target as Element).closest("table")) return;
      if (dx < 0) setTab(isAdmin ? "add" : "view");
      else setTab(isAdmin ? "view" : "add");
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [isAdmin, setTab]);

  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalH = Math.floor(totalMins / 60);
  const totalM = totalMins % 60;
  const period = { range, pickedMonth, customFrom, customTo };
  const periodTitle = formatPeriodTitle(period);
  const periodRange = formatPeriodRange(period);

  const getPeriodAndWorker = () => {
    const periodLabel = periodRange;
    const workerLabel = !isAdmin
      ? (entries[0]?.userName ?? "")
      : selectedUser
        ? (users.find((u) => u.uid === selectedUser)?.name ?? "")
        : "";
    return { periodLabel, workerLabel };
  };

  const handleCopyReport = () => {
    const { periodLabel, workerLabel } = getPeriodAndWorker();
    navigator.clipboard.writeText(buildReport(entries, periodLabel, workerLabel));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const viewOption: SegOption<"view" | "add"> = {
    value: "view",
    label: "Übersicht",
    icon: <FiList size={14} />,
  };
  const addOption: SegOption<"view" | "add"> = {
    value: "add",
    label: "Eintragen",
    icon: <HiPlus size={16} />,
  };
  const tabOptions = isAdmin ? [viewOption, addOption] : [addOption, viewOption];

  return (
    <>
      {/* <PageTitle>Arbeitsstunden</PageTitle> */}

      <TabBarWrapper>
        <SegmentedControl options={tabOptions} value={tab} onChange={setTab} variant="tabs" />
      </TabBarWrapper>

      {tab === "add" && (
        <>
          <SectionTitle>Stunden eintragen</SectionTitle>
          <AddHoursForm
            onAdded={() => {
              load();
              setTab("view");
            }}
          />
        </>
      )}

      {tab === "view" && (
        <>
          <ViewPanel>
            <StatsCard>
              <StatsPeriod>{periodTitle}</StatsPeriod>
              <StatsValue>
                {totalH}:{String(totalM).padStart(2, "0")} h
              </StatsValue>
              <StatsLabel>Gesamtstunden</StatsLabel>

              {!loading && entries.length > 0 && (
                <>
                  <StatsDivider />
                  <StatsActions>
                    <StatsBtn $done={copied} onClick={handleCopyReport}>
                      {copied ? <FiCheck size={15} /> : <FiCopy size={15} />}
                      {copied ? "Kopiert!" : "Bericht kopieren"}
                    </StatsBtn>
                    {isAdmin && (
                      <StatsBtn onClick={() => setShowWageModal(true)}>
                        <LuCalculator size={15} />
                        Lohn berechnen
                      </StatsBtn>
                    )}
                  </StatsActions>
                </>
              )}
            </StatsCard>

            <FilterBar
              isAdmin={isAdmin}
              periodRange={periodRange}
              range={range}
              setRange={setRange}
              pickedMonth={pickedMonth}
              setPickedMonth={setPickedMonth}
              customFrom={customFrom}
              customTo={customTo}
              setCustomRange={setCustomRange}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              users={users}
              exportMonth={exportMonth}
              setExportMonth={setExportMonth}
              exportToExcel={exportToExcel}
            />
          </ViewPanel>

          {!isOnline && !loading && entries.length === 0 && (
            <OfflineBanner message="Kein Internet – Stunden können nicht geladen werden" />
          )}
          {loading ? (
            <TableSkeleton />
          ) : (
            <>
              <HoursTable
                entries={entries}
                showWorker={isAdmin && !selectedUser}
                onDelete={load}
              />
              {refreshing && (
                <RefreshIndicator>
                  Aktualisierung
                  <RefreshDot />
                </RefreshIndicator>
              )}
            </>
          )}
        </>
      )}

      <WageModal
        isOpen={showWageModal}
        onClose={() => setShowWageModal(false)}
        entries={entries}
        getPeriodAndWorker={getPeriodAndWorker}
      />
    </>
  );
};

export default HoursPage;
