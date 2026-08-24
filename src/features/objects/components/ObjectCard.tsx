import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { format, isPast, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  FiMapPin,
  FiAlertTriangle,
  FiCalendar,
  FiMoreVertical,
  FiArchive,
  FiTrash2,
  FiChevronRight,
  FiFileText,
  FiHome,
} from 'react-icons/fi';
import { useAuth } from '@features/auth/hooks';
import { useObjectCard } from '../hooks/useObjectCard';
import { MapPreview } from '@shared/ui/MapPreview';
import type { CRMObject } from '@shared/types';
import {
  Card,
  Thumb,
  Content,
  Title,
  MenuWrapper,
  MenuBtn,
  Dropdown,
  DropdownItem,
  Location,
  MetaRow,
  MetaItem,
  Actions,
  Chevron,
} from './ObjectCard.styles';

interface Props {
  object: CRMObject;
}

export const ObjectCard: React.FC<Props> = ({ object }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { menuOpen, dropdownPos, dropdownRef, btnRef, archiving, openMenu, handleArchive, handleDelete } = useObjectCard(object);

  const deadline = object.deadline?.toDate?.();
  const isOverdue = deadline ? isPast(deadline) : false;
  const isSoon = deadline && !isOverdue
    ? differenceInDays(deadline, new Date()) <= 3
    : false;

  const noteCount = object.noteCount ?? 0;

  return (
    <>
      <Card
        $archiving={archiving}
        onClick={() => !archiving && navigate(`/objects/${object.id}`)}
      >
        <Thumb>
          <FiHome size={22} />
          <MapPreview address={object.address} city={object.city} fill />
        </Thumb>

        <Content>
          <Title>{object.title}</Title>

          <Location>
            <FiMapPin size={11} />
            <span>{object.address}, {object.city}</span>
          </Location>

          {(deadline || noteCount > 0) && (
            <MetaRow>
              {deadline && (
                <MetaItem $warn={isOverdue} $soon={isSoon}>
                  {isOverdue ? <FiAlertTriangle size={11} /> : <FiCalendar size={11} />}
                  {format(deadline, 'dd. MMM yy', { locale: de })}
                </MetaItem>
              )}
              {noteCount > 0 && (
                <MetaItem>
                  <FiFileText size={11} />
                  {noteCount} {noteCount === 1 ? 'Notiz' : 'Notizen'}
                </MetaItem>
              )}
            </MetaRow>
          )}
        </Content>

        <Actions>
          {isAdmin && (
            <MenuWrapper>
              <MenuBtn
                ref={btnRef}
                onClick={(e) => { e.stopPropagation(); openMenu(); }}
                title="Optionen"
                aria-label="Optionen"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <FiMoreVertical size={15} />
              </MenuBtn>
            </MenuWrapper>
          )}
          <Chevron>
            <FiChevronRight size={18} />
          </Chevron>
        </Actions>
      </Card>

      {isAdmin && menuOpen && dropdownPos && ReactDOM.createPortal(
        <Dropdown
          ref={dropdownRef}
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
        >
          <DropdownItem $success onClick={handleArchive}>
            <FiArchive size={14} />
            Archivieren
          </DropdownItem>
          <DropdownItem $danger onClick={handleDelete}>
            <FiTrash2 size={14} />
            Löschen
          </DropdownItem>
        </Dropdown>,
        document.body
      )}
    </>
  );
};
