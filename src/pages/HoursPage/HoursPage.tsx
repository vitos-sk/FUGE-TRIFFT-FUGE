import React, { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiList } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { LuCalculator } from "react-icons/lu";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { de } from "date-fns/locale";
import { AddHoursForm } from "@features/hours/components/AddHoursForm";
import { HoursTable } from "@features/hours/components/HoursTable";
import { useHoursPage } from "@features/hours/hooks/useHoursPage";
import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";
import { OfflineBanner } from "@shared/ui/OfflineBanner";
import type { WorkHourEntry } from "@shared/types";
import { WageModal } from "./components/WageModal";
import { FilterBar } from "./components/FilterBar";
import { TableSkeleton } from "./components/TableSkeleton";
import {
  TabBar,
  Tab,
  ViewPanel,
  StatsCard,
  StatsLeft,
  StatsLabel,
  StatsValue,
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
  const getPeriodAndWorker = () => {
    const now = new Date();
    let periodLabel: string;
    if (range === "month") {
      periodLabel = format(now, "MMMM yyyy", { locale: de });
    } else if (range === "week") {
      const ws = startOfWeek(now, { locale: de });
      const we = endOfWeek(now, { locale: de });
      periodLabel = `${format(ws, "dd.MM.")}–${format(we, "dd.MM.yyyy")}`;
    } else if (range === "pick") {
      const [y, m] = pickedMonth.split("-").map(Number);
      periodLabel = format(new Date(y, m - 1), "MMMM yyyy", { locale: de });
    } else {
      periodLabel = format(now, "yyyy");
    }
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

  const { periodLabel } = getPeriodAndWorker();

  return (
    <>
      {/* <PageTitle>Arbeitsstunden</PageTitle> */}

      <TabBar>
        {isAdmin ? (
          <>
            <Tab $active={tab === "view"} onClick={() => setTab("view")}>
              <FiList size={14} />
              Übersicht
            </Tab>
            <Tab $active={tab === "add"} onClick={() => setTab("add")}>
              <HiPlus size={16} />
              Eintragen
            </Tab>
          </>
        ) : (
          <>
            <Tab $active={tab === "add"} onClick={() => setTab("add")}>
              <HiPlus size={16} />
              Eintragen
            </Tab>
            <Tab $active={tab === "view"} onClick={() => setTab("view")}>
              <FiList size={14} />
              Übersicht
            </Tab>
          </>
        )}
      </TabBar>

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
              <StatsLeft>
                <StatsLabel>Gesamtstunden ({periodLabel})</StatsLabel>
                <StatsValue>
                  {totalH}:{String(totalM).padStart(2, "0")} h
                </StatsValue>
              </StatsLeft>

              {!loading && entries.length > 0 && (
                <StatsActions>
                  <StatsBtn $done={copied} onClick={handleCopyReport}>
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    {copied ? "Kopiert!" : "Bericht kopieren"}
                  </StatsBtn>
                  {isAdmin && (
                    <StatsBtn onClick={() => setShowWageModal(true)}>
                      <LuCalculator size={14} />€ Lohn berechnen
                    </StatsBtn>
                  )}
                </StatsActions>
              )}
            </StatsCard>

            <FilterBar
              isAdmin={isAdmin}
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
