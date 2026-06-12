import React from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { Input } from '@shared/ui/Input';
import type { CRMObject } from '@shared/types';
import {
  CheckList,
  CheckItem,
  CheckboxInput,
  CheckText,
  RemoveBtn,
  CheckProgressBar,
  CheckProgressLabel,
  AddRow,
  AddBtn,
  EmptyText,
} from './ChecklistTab.styles';

interface ChecklistTabProps {
  checklist: CRMObject['checklist'];
  doneCount: number;
  checklistPct: number;
  onToggleCheck: (id: string) => void;
  onRemoveItem: (id: string) => void;
  newCheckItem: string;
  setNewCheckItem: (v: string) => void;
  onAddItem: () => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  checklist,
  doneCount,
  checklistPct,
  onToggleCheck,
  onRemoveItem,
  newCheckItem,
  setNewCheckItem,
  onAddItem,
}) => (
  <div>
    {checklist.length > 0 && (
      <>
        <CheckProgressLabel>
          {doneCount} / {checklist.length} erledigt ({checklistPct}%)
        </CheckProgressLabel>
        <CheckProgressBar $pct={checklistPct} />
      </>
    )}
    <CheckList>
      {checklist.length === 0 && (
        <EmptyText>Keine Aufgaben in der Checkliste.</EmptyText>
      )}
      {checklist.map((item) => (
        <CheckItem key={item.id}>
          <CheckboxInput
            type="checkbox"
            checked={item.done}
            onChange={() => onToggleCheck(item.id)}
          />
          <CheckText $done={item.done}>{item.text}</CheckText>
          <RemoveBtn $variant="ghost" $size="sm" onClick={() => onRemoveItem(item.id)}>
            <FiX size={14} />
          </RemoveBtn>
        </CheckItem>
      ))}
    </CheckList>
    <AddRow>
      <Input
        value={newCheckItem}
        onChange={(e) => setNewCheckItem(e.target.value)}
        placeholder="Aufgabe hinzufügen…"
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddItem())}
      />
      <AddBtn onClick={onAddItem} disabled={!newCheckItem.trim()} title="Hinzufügen">
        <FiPlus size={15} />
      </AddBtn>
    </AddRow>
  </div>
);
