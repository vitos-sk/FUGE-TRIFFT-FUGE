import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiX, FiEdit2, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { Button } from '@shared/ui/Button';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { SegmentedControl } from '@shared/ui/SegmentedControl';
import { FieldBtn } from './FieldBtn';
import { DatePickerSheet } from './DatePickerSheet';
import { TimePickerSheet } from './TimePickerSheet';
import { ObjectPickerSheet } from './ObjectPickerSheet';
import { SubmitButton } from '@shared/ui/SubmitButton';
import { Modal } from '@shared/ui/Modal';
import { useHoursTable } from '../hooks/useHoursTable';
import { BREAK_OPTIONS, formatMinutes, formatDateDisplay } from '../utils/timeUtils';
import { LOCATION_NOTE_MAX } from '../utils/hoursConstants';
import type { WorkHourEntry } from '@shared/types';
import {
  Outer,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  ActionCell,
  Empty,
  HideMobile,
  EditStack,
  TwoCol,
  ModalFooter,
  FooterTotal,
  FooterBtns,
  ScrollTrack,
  ScrollThumb,
  DimTd,
  DimHideMobileTd,
  BoldTd,
  ActionBtnsDiv,
  LabelWithIndicator,
  RequiredDot,
  CharCountRow,
  CharCount,
} from './HoursTable.styles';

interface Props {
  entries: WorkHourEntry[];
  showWorker?: boolean;
  onDelete?: () => void;
}

export const HoursTable: React.FC<Props> = ({ entries, showWorker = false, onDelete }) => {
  const {
    uid,
    tableWrapperRef,
    thumbRef,
    thumbState,
    hasOverflow,
    handleTrackClick,
    handleThumbPointerDown,
    editEntry, setEditEntry,
    editDate, setEditDate,
    editStart, setEditStart,
    editEnd, setEditEnd,
    editBreak, setEditBreak,
    editObjectId, setEditObjectId,
    editLocationText, setEditLocationText,
    objects,
    saving,
    editDatePickerOpen, setEditDatePickerOpen,
    editStartPickerOpen, setEditStartPickerOpen,
    editEndPickerOpen, setEditEndPickerOpen,
    editObjectPickerOpen, setEditObjectPickerOpen,
    editTotal,
    editObjTitle,
    openEdit,
    handleSave,
    handleDelete,
  } = useHoursTable({ onDelete });

  if (entries.length === 0) {
    return (
      <Outer>
        <Empty>Keine Einträge für diesen Zeitraum.</Empty>
      </Outer>
    );
  }

  return (
    <>
      <Outer>
        <TableWrapper ref={tableWrapperRef}>
          <Table>
            <thead>
              <tr>
                <Th>Datum</Th>
                {showWorker && <Th>Mitarbeiter</Th>}
                <Th>Objekt</Th>
                <Th>Beginn</Th>
                <Th>Ende</Th>
                <HideMobile>Pause</HideMobile>
                <Th>Gesamt</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const isMobile = window.innerWidth < 640;
                const dateFormatted = format(new Date(e.date + 'T12:00:00'), isMobile ? 'dd.MM.' : 'dd.MM.yyyy', { locale: de });
                const isOwn = e.userId === uid;
                return (
                  <Tr key={e.id}>
                    <Td>{dateFormatted}</Td>
                    {showWorker && <DimTd>{e.userName}</DimTd>}
                    <DimTd>{e.objectTitle || '—'}</DimTd>
                    <Td>{e.startTime}</Td>
                    <Td>{e.endTime}</Td>
                    <DimHideMobileTd>
                      {e.breakMinutes > 0 ? `${e.breakMinutes} min` : '—'}
                    </DimHideMobileTd>
                    <BoldTd>{formatMinutes(e.totalMinutes)}</BoldTd>
                    <ActionCell>
                      {isOwn && (
                        <ActionBtnsDiv>
                          <Button $variant="ghost" $size="sm" onClick={() => openEdit(e)} title="Bearbeiten">
                            <FiEdit2 size={13} />
                          </Button>
                          <Button $variant="ghost" $size="sm"
                            onClick={() => handleDelete(e.id, dateFormatted)} title="Löschen">
                            <FiX size={14} />
                          </Button>
                        </ActionBtnsDiv>
                      )}
                    </ActionCell>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
        {hasOverflow && (
          <ScrollTrack onClick={handleTrackClick}>
            <ScrollThumb
              ref={thumbRef}
              style={{ left: `${thumbState.left}%`, width: `${thumbState.width}%` }}
              onPointerDown={handleThumbPointerDown}
            />
          </ScrollTrack>
        )}
      </Outer>

      <Modal isOpen={!!editEntry} onClose={() => setEditEntry(null)} title="Stunden bearbeiten" width="460px">
        <EditStack>
          <FieldBtn
            label="Datum"
            value={formatDateDisplay(editDate)}
            icon={<FiCalendar size={14} />}
            onClick={() => setEditDatePickerOpen(true)}
          />

          <TwoCol>
            <FieldBtn
              label="Beginn"
              value={editStart}
              icon={<FiClock size={14} />}
              onClick={() => setEditStartPickerOpen(true)}
            />
            <FieldBtn
              label="Ende"
              value={editEnd}
              icon={<FiClock size={14} />}
              onClick={() => setEditEndPickerOpen(true)}
            />
          </TwoCol>

          <FormGroup>
            <Label>Pause</Label>
            <SegmentedControl
              options={BREAK_OPTIONS}
              value={editBreak}
              onChange={(v) => setEditBreak(v as number)}
            />
          </FormGroup>

          <FieldBtn
            label={<LabelWithIndicator>Objekt{!editObjectId && <RequiredDot />}</LabelWithIndicator>}
            value={editObjTitle}
            icon={<FiMapPin size={14} />}
            onClick={() => setEditObjectPickerOpen(true)}
          />

          {!editObjectId && (
            <FormGroup>
              <CharCountRow>
                <Label>Wo gearbeitet?</Label>
                <CharCount $warn={editLocationText.length >= LOCATION_NOTE_MAX - 2}>
                  {editLocationText.length} / {LOCATION_NOTE_MAX}
                </CharCount>
              </CharCountRow>
              <Input
                type="text"
                value={editLocationText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLocationText(e.target.value)}
                placeholder="z.B. Baustelle Freiburg"
                maxLength={LOCATION_NOTE_MAX}
              />
            </FormGroup>
          )}

          <ModalFooter>
            <FooterTotal>{editTotal > 0 ? formatMinutes(editTotal) : '—'}</FooterTotal>
            <FooterBtns>
              <Button $variant="secondary" onClick={() => setEditEntry(null)}>Abbrechen</Button>
              <SubmitButton type="button" loading={saving} loadingText="Speichern…" disabled={editTotal <= 0} onClick={handleSave}>
                Speichern
              </SubmitButton>
            </FooterBtns>
          </ModalFooter>
        </EditStack>
      </Modal>

      <DatePickerSheet
        isOpen={editDatePickerOpen}
        onClose={() => setEditDatePickerOpen(false)}
        value={editDate}
        onChange={setEditDate}
      />
      <TimePickerSheet
        isOpen={editStartPickerOpen}
        onClose={() => setEditStartPickerOpen(false)}
        title="Beginn"
        value={editStart}
        onChange={setEditStart}
      />
      <TimePickerSheet
        isOpen={editEndPickerOpen}
        onClose={() => setEditEndPickerOpen(false)}
        title="Ende"
        value={editEnd}
        onChange={setEditEnd}
      />
      <ObjectPickerSheet
        isOpen={editObjectPickerOpen}
        onClose={() => setEditObjectPickerOpen(false)}
        value={editObjectId}
        onChange={setEditObjectId}
        objects={objects}
      />
    </>
  );
};
