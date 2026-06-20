import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isPast, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiAlertTriangle, FiCheckSquare, FiCalendar, FiMoreVertical, FiArchive, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@shared/hooks/useAuth';
import { useObjectCard } from '../hooks/useObjectCard';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
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
  CardBody,
  MetaRow,
  MetaItem,
  ChecklistBar,
  ChecklistLabel,
  ProgressTrack,
  ProgressFill,
  DeadlineGroup,
  ChecklistLabelLeft,
} from './ObjectCard.styles';

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
      onClick={() => !archiving && navigate(`/objects/${object.id}`)}
    >
      <MapPreview address={object.address} city={object.city} height={120} borderRadiusTop="8px" />
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
            <FiMapPin size={11} />
            {object.address}, {object.city}
          </Location>
        </CardMeta>
      </CardHeader>

      {(deadline || checkTotal > 0) && (
        <CardBody>
          {deadline && (
            <MetaRow>
              <DeadlineGroup>
                <MetaItem $warn={isOverdue} $soon={isSoon}>
                  {isOverdue ? <FiAlertTriangle size={11} /> : <FiCalendar size={11} />}
                  {format(deadline, 'dd. MMM yy', { locale: de })}
                </MetaItem>
              </DeadlineGroup>
            </MetaRow>
          )}

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
        </CardBody>
      )}
    </Card>
  );
};
