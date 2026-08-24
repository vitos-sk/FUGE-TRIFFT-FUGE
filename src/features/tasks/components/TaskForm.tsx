import React from 'react';
import { FormGroup, Label, Textarea } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { FiAlertTriangle, FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { FieldBtn } from './FieldBtn';
import { DatePickerSheet } from './DatePickerSheet';
import { TimePickerSheet } from './TimePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import { WorkerPickerSheet } from './WorkerPickerSheet';
import { useTaskForm } from '../hooks/useTaskForm';
import type { Task } from '@shared/types';
import { Form, TimeRow, ErrorBox, AddressPreview, Actions } from './TaskForm.styles';

const LOCATION_OPTIONS = [
  { value: 'object' as const, label: 'Objekt aus Liste' },
  { value: 'custom' as const, label: 'Eigene Adresse' },
];

const formatDateDisplay = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

interface Props {
  initial?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const TaskForm: React.FC<Props> = ({ initial, onSubmit, onCancel, submitLabel = 'Speichern' }) => {
  const {
    locationMode, setLocationMode,
    objectId, setObjectId,
    customLocation, setCustomLocation,
    workerId, setWorkerId,
    date, setDate,
    time, setTime,
    description, setDescription,
    objects,
    workers,
    loading,
    error,
    datePickerOpen, setDatePickerOpen,
    timePickerOpen, setTimePickerOpen,
    objectPickerOpen, setObjectPickerOpen,
    workerPickerOpen, setWorkerPickerOpen,
    selectedObjTitle,
    selectedWorkerName,
    isValid,
    handleSubmit,
  } = useTaskForm({ initial, onSubmit });

  const selectedObject = objects.find((o) => o.id === objectId);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorBox><FiAlertTriangle size={14} />{error}</ErrorBox>}

        <FormGroup>
          <Label>Standort</Label>
          <SegmentedControl
            options={LOCATION_OPTIONS}
            value={locationMode}
            onChange={setLocationMode}
          />
        </FormGroup>

        {locationMode === 'object' ? (
          <>
            <FieldBtn
              label="Objekt"
              value={selectedObjTitle}
              icon={<FiMapPin size={14} />}
              onClick={() => setObjectPickerOpen(true)}
            />
            {selectedObject && (
              <AddressPreview>
                <FiMapPin size={11} />
                {selectedObject.address}, {selectedObject.city}
              </AddressPreview>
            )}
          </>
        ) : (
          <FormGroup>
            <Label>Adresse</Label>
            <Textarea
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="z.B. Musterstraße 12, 79098 Freiburg"
              rows={2}
            />
          </FormGroup>
        )}

        <FieldBtn
          label="Mitarbeiter"
          value={selectedWorkerName}
          icon={<FiUser size={14} />}
          onClick={() => setWorkerPickerOpen(true)}
        />

        <TimeRow>
          <FieldBtn
            label="Datum"
            value={formatDateDisplay(date)}
            icon={<FiCalendar size={14} />}
            onClick={() => setDatePickerOpen(true)}
          />
          <FieldBtn
            label="Uhrzeit"
            value={time}
            icon={<FiClock size={14} />}
            onClick={() => setTimePickerOpen(true)}
          />
        </TimeRow>

        <FormGroup>
          <Label>Beschreibung</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was ist zu tun?"
            rows={3}
          />
        </FormGroup>

        <Actions>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          <SubmitButton loading={loading} loadingText="Speichern…" disabled={!isValid}>
            {submitLabel}
          </SubmitButton>
        </Actions>
      </Form>

      <DatePickerSheet
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        value={date}
        onChange={setDate}
      />
      <TimePickerSheet
        isOpen={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
        title="Uhrzeit"
        value={time}
        onChange={setTime}
      />
      <ObjectPickerSheet
        isOpen={objectPickerOpen}
        onClose={() => setObjectPickerOpen(false)}
        value={objectId}
        onChange={setObjectId}
        objects={objects}
      />
      <WorkerPickerSheet
        isOpen={workerPickerOpen}
        onClose={() => setWorkerPickerOpen(false)}
        value={workerId}
        onChange={setWorkerId}
        workers={workers}
      />
    </>
  );
};
