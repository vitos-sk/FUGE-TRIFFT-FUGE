import React, { useState } from 'react';
import { FiCopy, FiCheck, FiChevronDown } from 'react-icons/fi';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@shared/ui/Button';
import type { CRMObject } from '@shared/types';
import {
  MobileToggle,
  ToggleChevron,
  CollapsibleContent,
  InfoGrid,
  InfoItem,
  InfoItemWide,
  InfoLabel,
  InfoValue,
  CopyBtn,
  EditBtnWrap,
  DangerZone,
  DangerTitle,
} from './InfoTab.styles';

interface InfoTabProps {
  object: CRMObject;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const InfoTab: React.FC<InfoTabProps> = ({
  object,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(`${object.address}, ${object.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Collapsible toggle — visible only on mobile (<1025px) */}
      <MobileToggle
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
      >
        Objektdetails
        <ToggleChevron $open={mobileOpen}>
          <FiChevronDown size={14} />
        </ToggleChevron>
      </MobileToggle>

      {/* Content: always visible on desktop, toggled on mobile */}
      <CollapsibleContent $open={mobileOpen}>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Deadline</InfoLabel>
            <InfoValue>
              {object.deadline?.toDate?.()
                ? format(object.deadline.toDate(), 'dd.MM.yyyy', { locale: de })
                : '—'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Erstellt</InfoLabel>
            <InfoValue>
              {object.createdAt?.toDate?.()
                ? format(object.createdAt.toDate(), 'dd.MM.yyyy', { locale: de })
                : '—'}
            </InfoValue>
          </InfoItem>
          <InfoItemWide>
            <InfoLabel>Adresse</InfoLabel>
            <InfoValue>
              <span>
                {object.address}, {object.city}
              </span>
              <CopyBtn onClick={copyAddress} title="Adresse kopieren">
                {copied ? (
                  <FiCheck size={14} color="#22a35a" />
                ) : (
                  <FiCopy size={14} />
                )}
              </CopyBtn>
            </InfoValue>
          </InfoItemWide>
        </InfoGrid>

        {isAdmin && (
          <>
            <EditBtnWrap>
              <Button onClick={onEdit}>Bearbeiten</Button>
            </EditBtnWrap>
            <DangerZone>
              <DangerTitle>Gefahrenzone</DangerTitle>
              <Button $variant="danger" onClick={onDelete}>
                Objekt löschen
              </Button>
            </DangerZone>
          </>
        )}
      </CollapsibleContent>
    </div>
  );
};
