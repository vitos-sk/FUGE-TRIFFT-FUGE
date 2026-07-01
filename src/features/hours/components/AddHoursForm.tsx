import React from 'react';
import { FormGroup, Label, Input } from '@shared/ui/Input';
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
  ModalFormGroupLast,
  LongShiftText,
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
    modalObjectId, setModalObjectId,
    showLongShiftConfirm, setShowLongShiftConfirm,
    datePickerOpen, setDatePickerOpen,
    startPickerOpen, setStartPickerOpen,
    endPickerOpen, setEndPickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    modalObjectPickerOpen, setModalObjectPickerOpen,
    totalMins,
    selectedObjTitle,
    modalObjTitle,
    pendingCount,
    uid,
    handleSubmit,
    handleLongShiftConfirm,
    handleLocationConfirm,
  } = useAddHoursForm({ onAdded });

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
      <ObjectPickerSheet
        isOpen={modalObjectPickerOpen}
        onClose={() => setModalObjectPickerOpen(false)}
        value={modalObjectId}
        onChange={(v) => { setModalObjectId(v); setLocationNote(''); }}
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
              disabled={!modalObjectId && !locationNote.trim()}
              onClick={handleLocationConfirm}
            >
              Eintragen
            </SubmitButton>
          </ModalFooter>
        }
      >
        <FieldBtn
          label={
            <LabelWithIndicator>
              Objekt auswählen{!modalObjectId && <RequiredDot />}
            </LabelWithIndicator>
          }
          value={modalObjTitle}
          icon={<FiMapPin size={14} />}
          onClick={() => setModalObjectPickerOpen(true)}
        />

        {!modalObjectId && (
          <ModalFormGroupLast>
            <CharCountRow>
              <Label>Kurzbeschreibung *</Label>
              <CharCount $warn={locationNote.length >= 13}>
                {locationNote.length} / 15
              </CharCount>
            </CharCountRow>
            <Input
              type="text"
              value={locationNote}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationNote(e.target.value)}
              placeholder="z.B. Baustelle FB…"
              maxLength={15}
              autoFocus
            />
          </ModalFormGroupLast>
        )}
      </Modal>
    </>
  );
};
