import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@shared/ui/Button";
import { Modal } from "@shared/ui/Modal";
import type { WorkHourEntry } from "@shared/types";
import {
  RateRow,
  RateInputWrap,
  RateInput,
  RateSuffix,
  WageDivider,
  WageSummaryBox,
  WageSummaryRow,
  WageSummaryLabel,
  WageTotalRow,
  WageTotalLabel,
  WageTotalValue,
  WageBreakdownTitle,
  WageBreakdownList,
  WageBreakdownRow,
  WageRowMeta,
  WageRowDate,
  WageRowTime,
  WageRowPause,
  WageDot,
  WageRowBottom,
  WageRowObj,
  WageRowHours,
  WageRowAmount,
  WageModalFooter,
  WageCopyBtn,
} from "./WageModal.styles";

const fmtH = (mins: number) =>
  `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")} h`;

const fmtEur = (amount: number) =>
  amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  " €";

function buildWageReport(
  entries: WorkHourEntry[],
  periodLabel: string,
  workerLabel: string,
  rate: number,
): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const th = Math.floor(totalMins / 60);
  const tm = totalMins % 60;
  const totalWage = (totalMins / 60) * rate;

  const fmt2 = (n: number) =>
    n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const header = `Lohnabrechnung ${periodLabel}${workerLabel ? " – " + workerLabel : ""}`;
  const lines = sorted.map((e) => {
    const dateStr = format(new Date(e.date + "T12:00:00"), "dd.MM. EEE", { locale: de });
    const time = `${e.startTime}–${e.endTime}`;
    const pause = e.breakMinutes > 0 ? `-${e.breakMinutes}min` : "";
    const obj = e.objectTitle || "–";
    return [dateStr, time, pause, obj].filter(Boolean).join(" · ");
  });

  return [
    header,
    "",
    ...lines,
    "",
    `Gesamt: ${th}:${String(tm).padStart(2, "0")} h`,
    `Stundenlohn: ${fmt2(rate)} €/h`,
    `Lohn gesamt: ${fmt2(totalWage)} €`,
  ].join("\n");
}

interface WageModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: WorkHourEntry[];
  getPeriodAndWorker: () => { periodLabel: string; workerLabel: string };
}

export const WageModal: React.FC<WageModalProps> = ({
  isOpen,
  onClose,
  entries,
  getPeriodAndWorker,
}) => {
  const [hourlyRate, setHourlyRate] = useState("");
  const [wageCopied, setWageCopied] = useState(false);

  const rate = parseFloat(hourlyRate.replace(",", ".")) || 0;
  const totalMins = entries.reduce((acc, e) => acc + (e.totalMinutes || 0), 0);
  const totalWage = (totalMins / 60) * rate;
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const handleCopyWage = () => {
    const { periodLabel, workerLabel } = getPeriodAndWorker();
    navigator.clipboard.writeText(
      buildWageReport(entries, periodLabel, workerLabel, rate),
    );
    setWageCopied(true);
    setTimeout(() => setWageCopied(false), 2500);
  };

  const subheader = (
    <RateRow>
      <RateInputWrap>
        <RateInput
          type="text"
          inputMode="decimal"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          placeholder="0,00"
          aria-label="Stundenlohn in Euro"
          autoFocus
        />
        <RateSuffix>€/h</RateSuffix>
      </RateInputWrap>
    </RateRow>
  );

  const footer = (
    <WageModalFooter>
      {rate > 0 && (
        <WageCopyBtn $done={wageCopied} onClick={handleCopyWage}>
          {wageCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
          {wageCopied ? "Kopiert!" : "Abrechnung kopieren"}
        </WageCopyBtn>
      )}
      <Button $variant="secondary" $size="sm" onClick={onClose}>
        Schließen
      </Button>
    </WageModalFooter>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lohnberechnung"
      width="500px"
      height="80dvh"
      subheader={subheader}
      footer={footer}
    >
      {rate > 0 && (
        <>
          <WageDivider />

          <WageSummaryBox>
            <WageSummaryRow>
              <WageSummaryLabel>Gesamtstunden (Pausen abgezogen)</WageSummaryLabel>
              <span>{fmtH(totalMins)}</span>
            </WageSummaryRow>
            <WageSummaryRow>
              <WageSummaryLabel>Stundenlohn</WageSummaryLabel>
              <span>{fmtEur(rate)} / h</span>
            </WageSummaryRow>
            <WageTotalRow>
              <WageTotalLabel>Lohn gesamt</WageTotalLabel>
              <WageTotalValue>{fmtEur(totalWage)}</WageTotalValue>
            </WageTotalRow>
          </WageSummaryBox>

          <WageBreakdownTitle>Aufschlüsselung</WageBreakdownTitle>
          <WageBreakdownList>
            {sortedEntries.map((e) => {
              const dateStr = format(new Date(e.date + "T12:00:00"), "dd.MM. EEE", {
                locale: de,
              });
              const entryWage = (e.totalMinutes / 60) * rate;
              return (
                <WageBreakdownRow key={e.id}>
                  <WageRowMeta>
                    <WageRowDate>{dateStr}</WageRowDate>
                    <WageDot>·</WageDot>
                    <WageRowTime>
                      {e.startTime}–{e.endTime}
                    </WageRowTime>
                    {e.breakMinutes > 0 && (
                      <>
                        <WageDot>·</WageDot>
                        <WageRowPause>−{e.breakMinutes}min</WageRowPause>
                      </>
                    )}
                  </WageRowMeta>
                  <WageRowBottom>
                    <WageRowObj>{e.objectTitle || "—"}</WageRowObj>
                    <WageRowHours>{fmtH(e.totalMinutes)}</WageRowHours>
                    <WageRowAmount>{fmtEur(entryWage)}</WageRowAmount>
                  </WageRowBottom>
                </WageBreakdownRow>
              );
            })}
          </WageBreakdownList>
        </>
      )}
    </Modal>
  );
};
