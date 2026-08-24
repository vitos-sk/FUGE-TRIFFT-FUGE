import styled from 'styled-components';

export const PickerBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0.5rem 0 1.5rem;
`;

export const PickerRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const ColStepper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ColCaption = styled.span`
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  padding-bottom: 0.25rem;
`;

export const StepBtn = styled.button`
  width: 5rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  color: rgba(255, 255, 255, 0.3);
  transition: background 0.13s, color 0.13s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.75);
  }
  &:active {
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.9);
  }
`;

export const ColDisplay = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.02em;
  line-height: 1;
  min-width: 5rem;
  text-align: center;
  padding: 0.25rem 0;
`;

/* Colon offset: ColCaption (~1rem) + top StepBtn (2.75rem) + ColDisplay half (1.75rem) − Colon half (1.5rem) ≈ 4rem */
export const PickerColon = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.18);
  line-height: 1;
  margin-top: 4rem;
  flex-shrink: 0;
`;

export const ConfirmBtn = styled.button`
  width: 100%;
  min-height: 2.75rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: opacity 0.15s, transform 0.15s;
  margin-top: 0.25rem;

  &:hover { opacity: 0.88; }
  &:active { opacity: 0.75; transform: scale(0.98); }
`;
