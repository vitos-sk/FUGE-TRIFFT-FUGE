import React, { useId, useState } from 'react';
import { FiArrowLeft, FiCopy, FiCheck, FiShare2, FiUser } from 'react-icons/fi';
import { useWageCalc } from '@features/hours/hooks/useWageCalc';
import { formatHM } from '@features/hours/utils/timeUtils';
import { MonthNav } from '@features/hours/components/MonthNav';
import { FilterButton } from '@features/hours/components/FilterButton';
import { OptionSheet } from '@features/hours/components/OptionSheet';
import {
  Card,
  Perforation,
  OutlineBtn,
  TopBar,
  BackBtn,
  PageTitle,
} from '@features/hours/components/hoursUi.styles';
import { Button } from '@shared/ui/Button';
import {
  Screen,
  Params,
  Field,
  RateInput,
  Stats,
  Stat,
  Big,
  ReportBody,
  ReportText,
  Note,
  SkeletonLine,
  Actions,
} from './WagePage.styles';

const fmtEur = (n: number): string =>
  `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const WagePage: React.FC = () => {
  const w = useWageCalc();
  const rateId = useId();
  const [userSheetOpen, setUserSheetOpen] = useState(false);

  const renderReport = () => {
    if (w.loading) {
      return (
        <div aria-busy="true">
          <SkeletonLine $w="60%" />
          <SkeletonLine $w="90%" />
          <SkeletonLine $w="75%" />
        </div>
      );
    }
    if (w.failed && w.blocks.length === 0) {
      return (
        <Note>
          Die Stunden konnten nicht geladen werden.
          <OutlineBtn type="button" onClick={w.retry}>
            Erneut versuchen
          </OutlineBtn>
        </Note>
      );
    }
    if (w.blocks.length === 0) {
      return <Note>In diesem Monat gibt es keine Einträge.</Note>;
    }
    return <ReportText>{w.report}</ReportText>;
  };

  return (
    <Screen>
      <TopBar>
        <BackBtn type="button" onClick={w.goBack} aria-label="Zurück">
          <FiArrowLeft size={20} />
        </BackBtn>
        <PageTitle>Lohnrechner</PageTitle>
      </TopBar>

      <MonthNav month={w.month} onChange={w.changeMonth} />

      <Card>
        <Params>
          {w.isAdmin && (
            <Field>
              <label>Mitarbeiter</label>
              <FilterButton
                icon={<FiUser size={14} />}
                label={w.userLabel}
                active={!!w.userFilter}
                onClick={() => setUserSheetOpen(true)}
              />
            </Field>
          )}
          <Field>
            <label htmlFor={rateId}>Stundenlohn, €/h</label>
            <RateInput
              id={rateId}
              type="text"
              inputMode="decimal"
              value={w.rateInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                w.setRateInput(e.target.value.replace(/[^\d.,]/g, ''))
              }
              placeholder="z. B. 150"
              autoComplete="off"
            />
          </Field>
        </Params>
      </Card>

      <Card>
        <Stats>
          <Stat>
            <span>Stunden im Monat</span>
            <Big>{w.loading ? '—' : `${formatHM(w.totalMins)} h`}</Big>
          </Stat>
          <Stat $right>
            <span>Verdienst im Monat</span>
            {w.earnings === null ? <Big $muted>—</Big> : <Big>{fmtEur(w.earnings)}</Big>}
          </Stat>
        </Stats>
        <Perforation />
        <ReportBody>{renderReport()}</ReportBody>
      </Card>

      <Actions>
        <Button
          type="button"
          $size="lg"
          $fullWidth
          onClick={w.copyReport}
          disabled={w.loading || w.blocks.length === 0}
        >
          {w.copied ? <FiCheck size={15} /> : <FiCopy size={15} />}
          {w.copied ? 'Kopiert' : 'Kopieren'}
        </Button>
        {w.canShare && (
          <OutlineBtn type="button" onClick={w.shareReport} disabled={w.loading || w.blocks.length === 0}>
            <FiShare2 size={14} />
            Teilen
          </OutlineBtn>
        )}
      </Actions>

      <OptionSheet
        isOpen={userSheetOpen}
        onClose={() => setUserSheetOpen(false)}
        title="Mitarbeiter"
        value={w.userFilter}
        options={w.userOptions}
        onChange={w.setUserFilter}
      />
    </Screen>
  );
};

export default WagePage;
