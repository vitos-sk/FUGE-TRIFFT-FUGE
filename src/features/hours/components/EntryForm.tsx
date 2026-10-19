import React, { useId } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiArrowLeft, FiCalendar, FiChevronRight, FiAlertTriangle, FiWifiOff } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { Modal } from '@shared/ui/Modal';
import { useHoursEntryForm } from '../hooks/useHoursEntryForm';
import { BREAK_OPTIONS, formatHM, parseIsoDate } from '../utils/timeUtils';
import { LOCATION_NOTE_MAX } from '../utils/hoursConstants';
import { Card, Perforation, Caption, TopBar, BackBtn, PageTitle } from './hoursUi.styles';
import { DatePickerSheet } from './DatePickerSheet';
import { TimePickerSheet } from './TimePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import { TimeStepper } from './TimeStepper';
import { DayScale } from './DayScale';
import {
  Screen,
  DateLink,
  Notice,
  ObjectRow,
  RowTexts,
  RowValue,
  RowChevron,
  PlaceBlock,
  PlaceHead,
  Counter,
  PlaceInput,
  TimeBody,
  TimeGrid,
  BreakBody,
  BreakHead,
  NetTime,
  Chips,
  Chip,
  FieldError,
  Footer,
  SkeletonCard,
  Note,
  ModalFooter,
  LongShiftText,
} from './EntryForm.styles';

const formatDateLink = (iso: string): string => {
  const d = parseIsoDate(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return format(d, sameYear ? 'EEEE, d. MMMM' : 'EEEE, d. MMMM yyyy', { locale: de });
};

interface Props {
  /** Set to edit one of your own entries; omit to add a new one. */
  editId?: string;
}

/** Add / edit hours: object card, time card (±15 min, 24h ruler, break), one main button. */
export const EntryForm: React.FC<Props> = ({ editId }) => {
  const f = useHoursEntryForm(editId);
  const placeId = useId();

  const title = f.isEdit ? 'Bearbeiten' : 'Stunden eintragen';

  const header = (
    <>
      <TopBar>
        <BackBtn type="button" onClick={f.goBack} aria-label="Zurück">
          <FiArrowLeft size={20} />
        </BackBtn>
        <PageTitle>{title}</PageTitle>
      </TopBar>
    </>
  );

  if (f.notFound) {
    return (
      <Screen onSubmit={(e) => e.preventDefault()}>
        {header}
        <Note>
          Dieser Eintrag ist nicht verfügbar.
          <Button type="button" $variant="secondary" onClick={f.goBack}>
            Zurück
          </Button>
        </Note>
      </Screen>
    );
  }

  if (f.loadingEntry) {
    return (
      <Screen onSubmit={(e) => e.preventDefault()} aria-busy="true">
        {header}
        <SkeletonCard />
        <SkeletonCard />
      </Screen>
    );
  }

  return (
    <>
      <Screen onSubmit={f.handleSubmit} noValidate>
        {header}

        <DateLink type="button" onClick={() => f.setDatePickerOpen(true)}>
          <span>{formatDateLink(f.date)}</span>
          <FiCalendar size={15} />
        </DateLink>

        {f.error && (
          <Notice $tone="error" role="alert">
            <FiAlertTriangle size={14} />
            {f.error}
          </Notice>
        )}
        {!f.uid && (
          <Notice $tone="error" role="alert">
            <FiAlertTriangle size={14} />
            Kein Benutzer geladen. Bitte neu einloggen.
          </Notice>
        )}
        {!f.isOnline && (
          <Notice $tone="warn">
            <FiWifiOff size={14} />
            {f.isEdit
              ? 'Kein Internet – Bearbeiten ist nur online möglich.'
              : 'Kein Internet – der Eintrag wird gespeichert und automatisch übertragen.'}
          </Notice>
        )}

        {/* Card 1: where did you work */}
        <Card>
          <ObjectRow type="button" onClick={() => f.setObjectPickerOpen(true)}>
            <RowTexts>
              <Caption>Objekt</Caption>
              <RowValue $empty={!f.objectId}>{f.objectId ? f.objectTitle : 'Objekt auswählen'}</RowValue>
            </RowTexts>
            <RowChevron>
              <FiChevronRight size={18} />
            </RowChevron>
          </ObjectRow>

          {!f.objectId && (
            <>
              <Perforation />
              <PlaceBlock>
                <PlaceHead>
                  <label htmlFor={placeId}>Ort / Baustelle (wenn kein Objekt)</label>
                  <Counter $warn={f.locationNote.length >= LOCATION_NOTE_MAX - 2}>
                    {f.locationNote.length} / {LOCATION_NOTE_MAX}
                  </Counter>
                </PlaceHead>
                <PlaceInput
                  id={placeId}
                  type="text"
                  value={f.locationNote}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => f.setLocationNote(e.target.value)}
                  placeholder="z. B. Baustelle Freiburg"
                  maxLength={LOCATION_NOTE_MAX}
                  enterKeyHint="done"
                />
              </PlaceBlock>
            </>
          )}
        </Card>

        {/* Card 2: time and break */}
        <Card>
          <TimeBody>
            <TimeGrid>
              <TimeStepper
                label="Beginn"
                value={f.startTime}
                invalid={f.timeInvalid}
                onNudge={f.nudgeStart}
                onOpen={() => f.setStartPickerOpen(true)}
              />
              <TimeStepper
                label="Ende"
                value={f.endTime}
                invalid={f.timeInvalid}
                onNudge={f.nudgeEnd}
                onOpen={() => f.setEndPickerOpen(true)}
              />
            </TimeGrid>
            <DayScale start={f.startTime} end={f.endTime} />
          </TimeBody>

          <Perforation />

          <BreakBody>
            <BreakHead>
              <Caption>Pause</Caption>
              <NetTime>
                Dauer <strong>{f.timeInvalid ? '—' : formatHM(f.totalMins)}</strong>
              </NetTime>
            </BreakHead>
            <Chips role="radiogroup" aria-label="Pause">
              {BREAK_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={f.breakMins === opt.value}
                  $active={f.breakMins === opt.value}
                  onClick={() => f.setBreakMins(opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </Chips>
            {f.timeInvalid && (
              <FieldError role="alert">
                Die Zeit ist nicht gültig. Bitte Beginn, Ende oder Pause prüfen.
              </FieldError>
            )}
          </BreakBody>
        </Card>

        <Footer>
          <SubmitButton fullWidth loading={f.saving} loadingText="Speichern…" disabled={!f.canSave}>
            {f.submitLabel}
          </SubmitButton>
        </Footer>
      </Screen>

      <DatePickerSheet
        isOpen={f.datePickerOpen}
        onClose={() => f.setDatePickerOpen(false)}
        value={f.date}
        onChange={f.setDate}
      />
      <TimePickerSheet
        isOpen={f.startPickerOpen}
        onClose={() => f.setStartPickerOpen(false)}
        title="Beginn"
        value={f.startTime}
        onChange={f.setStartTime}
      />
      <TimePickerSheet
        isOpen={f.endPickerOpen}
        onClose={() => f.setEndPickerOpen(false)}
        title="Ende"
        value={f.endTime}
        onChange={f.setEndTime}
      />
      <ObjectPickerSheet
        isOpen={f.objectPickerOpen}
        onClose={() => f.setObjectPickerOpen(false)}
        value={f.objectId}
        onChange={f.setObjectId}
        objects={f.objects}
      />

      <Modal
        isOpen={f.longShiftOpen}
        onClose={() => f.setLongShiftOpen(false)}
        title="Lange Schicht?"
        footer={
          <ModalFooter>
            <Button $variant="secondary" type="button" onClick={() => f.setLongShiftOpen(false)}>
              Abbrechen
            </Button>
            <SubmitButton type="button" loading={f.saving} loadingText="Speichern…" onClick={f.confirmLongShift}>
              Ja, stimmt so
            </SubmitButton>
          </ModalFooter>
        }
      >
        <LongShiftText>
          Du hast wirklich so lange gearbeitet?
          <strong>{formatHM(f.totalMins)} h</strong>
          {f.startTime} – {f.endTime} Uhr
        </LongShiftText>
      </Modal>
    </>
  );
};
