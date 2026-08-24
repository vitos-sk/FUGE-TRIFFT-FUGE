import React from 'react';
import { SegmentedControl } from '@shared/ui';
import { DASHBOARD_PERIODS } from '@features/dashboard/utils/period';
import type { DashboardPeriod } from '@features/dashboard/utils/period';
import { SwitchRow, PeriodLabel, SwitchWrap } from './PeriodSwitch.styles';

interface PeriodSwitchProps {
  period: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
  label: string;
}

export const PeriodSwitch: React.FC<PeriodSwitchProps> = ({ period, onChange, label }) => (
  <SwitchRow>
    <PeriodLabel>{label}</PeriodLabel>
    <SwitchWrap>
      <SegmentedControl options={DASHBOARD_PERIODS} value={period} onChange={onChange} />
    </SwitchWrap>
  </SwitchRow>
);
