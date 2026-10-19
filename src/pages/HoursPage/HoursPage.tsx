import React, { useState } from 'react';
import { FiCopy, FiCheck, FiDownload, FiUser, FiMapPin } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { LuCalculator } from 'react-icons/lu';
import { useHoursPage } from '@features/hours/hooks/useHoursPage';
import { formatHM } from '@features/hours/utils/timeUtils';
import { MonthNav } from '@features/hours/components/MonthNav';
import { ShiftList } from '@features/hours/components/ShiftList';
import { FilterButton } from '@features/hours/components/FilterButton';
import { OptionSheet } from '@features/hours/components/OptionSheet';
import { OutlineBtn } from '@features/hours/components/hoursUi.styles';
import { SegmentedControl, type SegOption } from '@shared/ui/SegmentedControl';
import { OfflineBanner } from '@shared/ui/OfflineBanner';
import type { HoursScope } from '@features/hours/types';
import {
  Page,
  Header,
  Title,
  AddBtn,
  Controls,
  ScopeWrap,
  Filters,
  ExportWrap,
  Layout,
  Side,
  ListArea,
  SideButtons,
  TotalCard,
  TotalLabel,
  TotalValue,
} from './HoursPage.styles';

const SCOPE_OPTIONS: SegOption<HoursScope>[] = [
  { value: 'team', label: 'Team' },
  { value: 'me', label: 'Ich' },
];

const HoursPage: React.FC = () => {
  const h = useHoursPage();
  const [userSheetOpen, setUserSheetOpen] = useState(false);
  const [objectSheetOpen, setObjectSheetOpen] = useState(false);

  const showFilters = h.isAdmin && h.scope === 'team';

  return (
    <Page>
      <Header>
        <Title>Stunden</Title>
        <AddBtn type="button" onClick={h.goToNew}>
          <HiPlus size={18} />
          Eintragen
        </AddBtn>
      </Header>

      <MonthNav month={h.month} onChange={h.changeMonth} />

      {h.isAdmin && (
        <Controls>
          <ScopeWrap>
            <SegmentedControl options={SCOPE_OPTIONS} value={h.scope} onChange={h.changeScope} />
          </ScopeWrap>
          {showFilters && (
            <Filters>
              <FilterButton
                icon={<FiUser size={14} />}
                label={h.userFilterLabel}
                active={!!h.userFilter}
                onClick={() => setUserSheetOpen(true)}
              />
              <FilterButton
                icon={<FiMapPin size={14} />}
                label={h.objectFilterLabel}
                active={!!h.objectFilter}
                onClick={() => setObjectSheetOpen(true)}
              />
            </Filters>
          )}
          <ExportWrap>
            <OutlineBtn type="button" onClick={h.exportToExcel} disabled={h.visible.length === 0}>
              <FiDownload size={14} />
              Export
            </OutlineBtn>
          </ExportWrap>
        </Controls>
      )}

      {!h.isOnline && <OfflineBanner message="Kein Internet – es werden die zuletzt gespeicherten Stunden gezeigt" />}
      {h.pendingCount > 0 && (
        <OfflineBanner
          message={
            h.isOnline
              ? `${h.pendingCount} gespeicherte Einträge werden gerade übertragen…`
              : `${h.pendingCount} gespeicherte Einträge werden übertragen, sobald du wieder online bist`
          }
        />
      )}

      <Layout>
        <Side>
          {!h.isAdmin && !h.loading && (
            <TotalCard>
              <TotalLabel>Gearbeitet im Monat</TotalLabel>
              <TotalValue>{formatHM(h.totalMins)} h</TotalValue>
            </TotalCard>
          )}
          <SideButtons>
            <OutlineBtn type="button" onClick={h.goToWage}>
              <LuCalculator size={15} />
              Lohnrechner
            </OutlineBtn>
            <OutlineBtn type="button" $done={h.copied} onClick={h.copyReport} disabled={h.visible.length === 0}>
              {h.copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              {h.copied ? 'Kopiert!' : 'Bericht kopieren'}
            </OutlineBtn>
          </SideButtons>
        </Side>

        <ListArea>
          <ShiftList
            entries={h.visible}
            limit={h.limit}
            onShowMore={h.showMore}
            totalMins={h.totalMins}
            loading={h.loading}
            refreshing={h.refreshing}
            failed={h.failed}
            onRetry={h.retry}
            isFiltered={h.isFiltered}
            showWorker={h.showWorker}
            uid={h.uid}
            expandedId={h.expandedId}
            onToggle={h.toggleExpanded}
            onEdit={h.goToEdit}
            onDelete={h.deleteEntry}
          />
        </ListArea>
      </Layout>

      <OptionSheet
        isOpen={userSheetOpen}
        onClose={() => setUserSheetOpen(false)}
        title="Mitarbeiter"
        value={h.userFilter}
        options={h.userOptions}
        onChange={h.changeUserFilter}
      />
      <OptionSheet
        isOpen={objectSheetOpen}
        onClose={() => setObjectSheetOpen(false)}
        title="Objekt"
        value={h.objectFilter}
        options={h.objectOptions}
        onChange={h.changeObjectFilter}
      />
    </Page>
  );
};

export default HoursPage;
