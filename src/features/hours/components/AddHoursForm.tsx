import React, { useId } from 'react';
import { FormGroup, Label } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { Modal } from '@shared/ui/Modal';
import { FiAlertTriangle, FiWifi, FiCalendar, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { FieldBtn } from './FieldBtn';
import { TimePickerSheet } from './TimePickerSheet';
import { DatePickerSheet } from './DatePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import { useAddHoursForm } from '../hooks/useAddHoursForm';
import { BREAK_OPTIONS, formatMinutes, formatDateDisplay } from '../utils/timeUtils';
import { LOCATION_NOTE_MAX } from '../utils/hoursConstants';
import {
  Form,
  TimeBlock,
  TimeRow,
  TimeArrow,
  TimeResult,
  TimeResultValue,
  TimeResultLabel,
  ObjektRow,
  ObjektSelectWrap,
  ErrorBox,
  OfflineBannerDiv,
  LabelWithIndicator,
  RequiredDot,
  ModalFooter,
  CharCountRow,
  CharCount,
  LongShiftText,
  LocationHint,
  LocationInput,
  LocationExample,
} from './AddHoursForm.styles';

interface Props {
  onAdded?: () => void;
}

export const AddHoursForm: React.FC<Props> = ({ onAdded }) => {
  const {
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    breakMins, setBreakMins,
    objectId, setObjectId,
    objects,
    loading,
    error,
    isOnline,
    locationNote, setLocationNote,
    showLocationModal, setShowLocationModal,
    showLongShiftConfirm, setShowLongShiftConfirm,
    datePickerOpen, setDatePickerOpen,
    startPickerOpen, setStartPickerOpen,
    endPickerOpen, setEndPickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    totalMins,
    selectedObjTitle,
    pendingCount,
    uid,
    handleSubmit,
    handleLongShiftConfirm,
    handleLocationConfirm,
  } = useAddHoursForm({ onAdded });

  const locationInputId = useId();

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorBox><FiAlertTriangle size={14} />{error}</ErrorBox>}
        {!uid && (
          <ErrorBox><FiAlertTriangle size={14} />Kein Benutzer geladen. Bitte neu einloggen.</ErrorBox>
        )}
        {!isOnline && (
          <OfflineBannerDiv>
            <FiWifi size={14} />
            Kein Internet – Einträge werden gespeichert und automatisch übertragen.
          </OfflineBannerDiv>
        )}
        {isOnline && pendingCount > 0 && (
          <OfflineBannerDiv>
            <FiWifi size={14} />
            {pendingCount} gespeicherte{pendingCount > 1 ? ' Einträge werden' : 'r Eintrag wird'} gerade übertragen…
          </OfflineBannerDiv>
        )}

        <FieldBtn
          label="Datum"
          value={formatDateDisplay(date)}
          icon={<FiCalendar size={14} />}
          onClick={() => setDatePickerOpen(true)}
        />

        <TimeBlock>
          <TimeRow>
            <FieldBtn
              label="Beginn"
              value={startTime}
              icon={<FiClock size={14} />}
              onClick={() => setStartPickerOpen(true)}
              $prominent
            />
            <TimeArrow><FiArrowRight size={15} /></TimeArrow>
            <FieldBtn
              label="Ende"
              value={endTime}
              icon={<FiClock size={14} />}
              onClick={() => setEndPickerOpen(true)}
              $prominent
            />
          </TimeRow>
          {totalMins > 0 && (
            <TimeResult>
              <TimeResultValue>{formatMinutes(totalMins)}</TimeResultValue>
              <TimeResultLabel>Arbeitszeit</TimeResultLabel>
            </TimeResult>
          )}
        </TimeBlock>

        <FormGroup>
          <Label>Pause</Label>
          <SegmentedControl
            options={BREAK_OPTIONS}
            value={breakMins}
            onChange={(v) => setBreakMins(v as number)}
          />
        </FormGroup>

        <ObjektRow>
          <ObjektSelectWrap>
            <FieldBtn
              label={<LabelWithIndicator>Objekt{!objectId && <RequiredDot />}</LabelWithIndicator>}
              value={selectedObjTitle}
              icon={<FiMapPin size={14} />}
              onClick={() => setObjectPickerOpen(true)}
            />
          </ObjektSelectWrap>
          <SubmitButton loading={loading} disabled={totalMins <= 0}>
            <HiPlus size={20} />
          </SubmitButton>
        </ObjektRow>
      </Form>

      <DatePickerSheet
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        value={date}
        onChange={setDate}
      />
      <TimePickerSheet
        isOpen={startPickerOpen}
        onClose={() => setStartPickerOpen(false)}
        title="Beginn"
        value={startTime}
        onChange={setStartTime}
      />
      <TimePickerSheet
        isOpen={endPickerOpen}
        onClose={() => setEndPickerOpen(false)}
        title="Ende"
        value={endTime}
        onChange={setEndTime}
      />
      <ObjectPickerSheet
        isOpen={objectPickerOpen}
        onClose={() => setObjectPickerOpen(false)}
        value={objectId}
        onChange={setObjectId}
        objects={objects}
      />

      <Modal
        isOpen={showLongShiftConfirm}
        onClose={() => setShowLongShiftConfirm(false)}
        title="Lange Schicht?"
        footer={
          <ModalFooter>
            <Button $variant="secondary" type="button" onClick={() => setShowLongShiftConfirm(false)}>
              Abbrechen
            </Button>
            <SubmitButton
              type="button"
              loading={loading}
              loadingText="Speichern…"
              onClick={handleLongShiftConfirm}
            >
              Ja, stimmt so
            </SubmitButton>
          </ModalFooter>
        }
      >
        <LongShiftText>
          Du hast wirklich so lange gearbeitet?
          <strong>{formatMinutes(totalMins)}</strong>
          {startTime} – {endTime} Uhr
        </LongShiftText>
      </Modal>

      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Wo hast du gearbeitet?"
        alignTop
        footer={
          <ModalFooter>
            <Button $variant="secondary" type="button" onClick={() => setShowLocationModal(false)}>
              Abbrechen
            </Button>
            <SubmitButton
              type="button"
              loading={loading}
              loadingText="Speichern…"
              disabled={!locationNote.trim()}
              onClick={handleLocationConfirm}
            >
              Eintragen
            </SubmitButton>
          </ModalFooter>
        }
      >
        <LocationHint>
          Du hast kein Objekt ausgewählt. Schreib kurz auf, wo du gearbeitet hast –
          dieser Text steht dann in deiner Stundenliste anstelle des Objekts.
        </LocationHint>

        <FormGroup>
          <CharCountRow>
            <Label htmlFor={locationInputId}>
              <LabelWithIndicator>
                Ort / Baustelle{!locationNote.trim() && <RequiredDot />}
              </LabelWithIndicator>
            </Label>
            <CharCount $warn={locationNote.length >= LOCATION_NOTE_MAX - 2}>
              {locationNote.length} / {LOCATION_NOTE_MAX}
            </CharCount>
          </CharCountRow>
          <LocationInput
            id={locationInputId}
            type="text"
            value={locationNote}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationNote(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && locationNote.trim()) {
                e.preventDefault();
                handleLocationConfirm();
              }
            }}
            placeholder="z.B. Baustelle Freiburg"
            maxLength={LOCATION_NOTE_MAX}
            enterKeyHint="done"
            autoFocus
          />
          <LocationExample>
            z.B. „Baustelle Freiburg“, „Lager“, „Werkstatt“ oder „Fahrt Kunde Müller“
          </LocationExample>
        </FormGroup>

      </Modal>
    </>
  );
};
