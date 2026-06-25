import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { format, isPast, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { FiMapPin, FiAlertTriangle, FiCalendar, FiMoreVertical, FiArchive, FiTrash2 } from 'react-icons/fi';
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
  DeadlineGroup,
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

  return (
    <>
      <Card
        $archiving={archiving}
        onClick={() => !archiving && navigate(`/objects/${object.id}`)}
      >
        <MapPreview address={object.address} city={object.city} height={120} borderRadiusTop="8px" />
        <CardHeader>
          <CardTop>
            <Title>{object.title}</Title>

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
          </CardTop>

          <CardMeta>
            <Location>
              <FiMapPin size={11} />
              {object.address}, {object.city}
            </Location>
          </CardMeta>
        </CardHeader>

        {deadline && (
          <CardBody>
            <MetaRow>
              <DeadlineGroup>
                <MetaItem $warn={isOverdue} $soon={isSoon}>
                  {isOverdue ? <FiAlertTriangle size={11} /> : <FiCalendar size={11} />}
                  {format(deadline, 'dd. MMM yy', { locale: de })}
                </MetaItem>
              </DeadlineGroup>
            </MetaRow>
          </CardBody>
        )}
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
