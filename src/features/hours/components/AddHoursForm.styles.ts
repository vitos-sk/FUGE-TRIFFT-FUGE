import styled from 'styled-components';
import { FormGroup } from '@shared/ui/Input';

export const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 24px rgba(0, 0, 0, 0.5);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 374px) {
    padding: 14px 12px;
    gap: 12px;
  }

  @media (min-width: 640px) {
    max-width: 580px;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

export const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    gap: 12px;

    > *:first-child { flex: 1; }
    > *:last-child  { flex: 2; }
  }
`;

// На десктопе — один ряд [Objekt] [9:30 h] [+], на мобиле — колонка
export const ObjektRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    gap: 10px;
  }
`;

// Обёртка селектора — на десктопе занимает оставшееся место (~70%)
export const ObjektSelectWrap = styled.div`
  @media (min-width: 640px) {
    flex: 1;
    min-width: 0;
  }
`;

// [TotalDisplay] + [SubmitButton] рядом
export const ObjektRowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const TotalDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  min-width: 110px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.04em;
  white-space: nowrap;

  @media (max-width: 640px) {
    flex: 1;
    padding: 6px 14px;
  }
`;

export const ErrorBox = styled.div`
  padding: 11px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OfflineBannerDiv = styled.div`
  padding: 10px 14px;
  background: rgba(255, 180, 0, 0.08);
  border: 1px solid rgba(255, 180, 0, 0.25);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 12px;
  font-weight: 600;
  color: #f0a800;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
`;

export const LabelWithIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const RequiredDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cc2222;
  box-shadow: 0 0 6px #cc222299;
  display: inline-block;
  flex-shrink: 0;
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const CharCountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
`;

export const CharCount = styled.span<{ $warn: boolean }>`
  font-size: 11px;
  color: ${({ $warn }) => ($warn ? '#cc2222' : '#555')};
  font-variant-numeric: tabular-nums;
`;

export const ModalFormGroupLast = styled(FormGroup)`
  margin-top: 16px;
`;
