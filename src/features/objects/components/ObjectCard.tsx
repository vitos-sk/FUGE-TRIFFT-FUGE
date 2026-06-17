import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isPast, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiAlertTriangle, FiMessageSquare, FiCheckSquare, FiCalendar, FiMoreVertical, FiArchive, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@shared/hooks/useAuth';
import { useObjectCard } from '../hooks/useObjectCard';
import { MapPreview } from '@shared/ui/MapPreview';
import { Badge } from '@shared/ui/Badge';
import type { CRMObject } from '@shared/types';
import { OBJECT_STATUS } from '../../../constants';
import {
  Card,
  CardHeader,
  CardTop,
  Title,
  MenuWrapper,
  MenuBtn,
  Dropdown,
  DropdownItem,
  CardMeta,
  Location,
  Divider,
  CardBody,
  MetaRow,
  MetaItem,
  NoteCount,
  ChecklistBar,
  ChecklistLabel,
  ProgressTrack,
  ProgressFill,
  LastNote,
  LastNoteAuthor,
  DeadlineGroup,
  ChecklistLabelLeft,
} from './ObjectCard.styles';

const STATUS_LABELS: Record<string, string> = {
  new: 'Neu',
  in_progress: 'In Arbeit',
  paused: 'Pausiert',
  done: 'Fertig',
};

interface Props {
  object: CRMObject;
}

export const ObjectCard: React.FC<Props> = ({ object }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { menuOpen, setMenuOpen, archiving, menuRef, handleArchive, handleDelete } = useObjectCard(object);

  const deadline = object.deadline?.toDate?.();
  const isOverdue = deadline ? isPast(deadline) : false;
  const isSoon = deadline && !isOverdue
    ? differenceInDays(deadline, new Date()) <= 3
    : false;

  const checklist = object.checklist ?? [];
  const checkTotal = checklist.length;
  const checkDone = checklist.filter((c) => c.done).length;
  const checkPct = checkTotal > 0 ? Math.round((checkDone / checkTotal) * 100) : 0;
  const allDone = checkTotal > 0 && checkDone === checkTotal;

  return (
    <Card
      $archiving={archiving}
      $status={object.status}
      onClick={() => !archiving && navigate(`/objects/${object.id}`)}
    >
      <MapPreview address={object.address} city={object.city} height={148} borderRadiusTop="7px" />
      <CardHeader>
        <CardTop>
          <Title>{object.title}</Title>

          {isAdmin && (
            <MenuWrapper ref={menuRef}>
              <MenuBtn
                onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                title="Optionen"
                aria-label="Optionen"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <FiMoreVertical size={15} />
              </MenuBtn>
              {menuOpen && (
                <Dropdown>
                  <DropdownItem $success onClick={handleArchive}>
                    <FiArchive size={14} />
                    Archivieren
                  </DropdownItem>
                  <DropdownItem $danger onClick={handleDelete}>
                    <FiTrash2 size={14} />
                    Löschen
                  </DropdownItem>
                </Dropdown>
              )}
            </MenuWrapper>
          )}
        </CardTop>

        <CardMeta>
          <Location>
            <FiMapPin size={12} />
            {object.address}, {object.city}
          </Location>
          <Badge $status={object.status}>{STATUS_LABELS[object.status]}</Badge>
        </CardMeta>
      </CardHeader>

      <Divider />

      <CardBody>
        <MetaRow>
          <DeadlineGroup>
            {deadline && (
              <MetaItem $warn={isOverdue} $ok={!isOverdue && !isSoon && object.status === OBJECT_STATUS.DONE}>
                {isOverdue ? <FiAlertTriangle size={12} /> : <FiCalendar size={12} />}
                {format(deadline, 'dd. MMM yy', { locale: de })}
              </MetaItem>
            )}
          </DeadlineGroup>
          {(object.noteCount ?? 0) > 0 && (
            <NoteCount>
              <FiMessageSquare size={11} />
              {object.noteCount}
            </NoteCount>
          )}
        </MetaRow>

        {checkTotal > 0 && (
          <ChecklistBar>
            <ChecklistLabel>
              <ChecklistLabelLeft>
                <FiCheckSquare size={10} />
                Checkliste
              </ChecklistLabelLeft>
              <span>{checkDone}/{checkTotal}</span>
            </ChecklistLabel>
            <ProgressTrack>
              <ProgressFill $pct={checkPct} $done={allDone} />
            </ProgressTrack>
          </ChecklistBar>
        )}

        {object.lastNoteText && (
          <LastNote>
            {object.lastNoteAuthor && (
              <LastNoteAuthor>{object.lastNoteAuthor.split(' ')[0]}:</LastNoteAuthor>
            )}
            {object.lastNoteText}
          </LastNote>
        )}
      </CardBody>
    </Card>
  );
};
